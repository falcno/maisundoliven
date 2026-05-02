import React, { useEffect, useRef, useState } from 'react';
import { type PlayerData, UPGRADES } from '../types';
import './GameCanvas.css';

interface GameCanvasProps {
  playerData: PlayerData;
  onGameOver: (collectedCoupons: number, score: number) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ playerData, onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [coupons, setCoupons] = useState(0);
  
  // Image Cache
  const imagesRef = useRef<Record<string, HTMLImageElement>>({});

  // Audio Context for simple sounds

  // Audio Context for simple sounds
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Game State
  const gameStateRef = useRef({
    lives: 1 + playerData.purchasedUpgrades.filter(id => UPGRADES[id].grantsExtraLife).length,
    hasCar: playerData.purchasedUpgrades.includes('araba'),
    score: 0,
    coupons: 0,
    speed: 4,
    bgOffset: 0,
    level: 1,
    player: {
      x: 50,
      y: 200,
      width: 50,
      height: 75,
      vy: 0,
      gravity: 0.4,
      jumpPower: -10,
      isGrounded: false,
      isInvulnerable: false,
      invulnerableTimer: 0,
      frameCount: 6,
      currentFrame: 0,
      animationTimer: 0,
      animationSpeed: 80
    },
    obstacles: [] as any[],
    collectibles: [] as any[],
    lastObstacleTime: 0,
    lastCollectibleTime: 0,
    groundY: window.innerHeight * 0.8,
    shake: 0,
    particles: [] as any[]
  });

  const playSound = (type: 'jump' | 'hit' | 'coin') => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    if (type === 'jump') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'hit') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'coin') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.setValueAtTime(600, ctx.currentTime + 0.05);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const scale = Math.min(canvas.height / 800, 1.2); // Cap the scale
      gameStateRef.current.groundY = canvas.height * 0.85; // Ground is always at bottom 15%
      
      if (gameStateRef.current.hasCar) {
        gameStateRef.current.player.width = 110 * scale;
        gameStateRef.current.player.height = 55 * scale;
      } else {
        gameStateRef.current.player.width = 40 * scale;
        gameStateRef.current.player.height = 65 * scale;
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const jump = () => {
      const state = gameStateRef.current;
      if (state.player.isGrounded) {
        const scale = Math.min(canvas.height / 800, 1.2);
        state.player.vy = state.player.jumpPower * scale;
        state.player.isGrounded = false;
        playSound('jump');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') jump();
    };
    
    const handleTouch = () => {
      jump();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('mousedown', handleTouch);

    // Load Images
    const loadImages = () => {
      const imgSources: Record<string, string> = {
        player: '/assets/dilsad_run.png',
        car: '/assets/dilsad_car.png',
        book: '/assets/book.png',
        coupon: '/assets/coupon.png',
        bg1: '/assets/bg_tau.png',
        bg2: '/assets/bg_tk.png',
        bg3: '/assets/bg_tu.png',
        bg4: '/assets/bg_wedding.png',
      };
      for (const [key, src] of Object.entries(imgSources)) {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          imagesRef.current[key] = img;
          console.log(`Loaded: ${key}`);
        };
        img.onerror = () => console.error(`Failed to load: ${key}`);
      }
    };
    loadImages();

    let lastTime = performance.now();

    const gameLoop = (time: number) => {
      if (isGameOver) return;
      
      const deltaTime = time - lastTime;
      lastTime = time;
      const state = gameStateRef.current;
      
      // Speed Normalization (Target 60fps)
      const speedFactor = Math.min(deltaTime / 16.6, 3);
      const scale = Math.min(canvas.height / 800, 1.2);

      state.score += deltaTime * 0.01;
      setScore(Math.floor(state.score));
      
      if (state.score > 1000) state.level = 4;
      else if (state.score > 600) state.level = 3;
      else if (state.score > 300) state.level = 2;

      state.speed = (5 + (state.score / 200)) * scale;

      state.player.vy += state.player.gravity * scale * speedFactor;
      state.player.y += state.player.vy * speedFactor;

      if (state.player.y + state.player.height >= state.groundY) {
        state.player.y = state.groundY - state.player.height;
        state.player.vy = 0;
        state.player.isGrounded = true;
      }

      // Animation
      if (state.player.isGrounded && !state.hasCar) {
        state.player.animationTimer += deltaTime;
        if (state.player.animationTimer >= state.player.animationSpeed) {
          state.player.currentFrame = (state.player.currentFrame + 1) % state.player.frameCount;
          state.player.animationTimer = 0;
        }
      } else {
        state.player.currentFrame = 0; 
      }

      // Update Shake
      if (state.shake > 0) {
        state.shake *= 0.9;
        if (state.shake < 0.1) state.shake = 0;
      }

      // Update Particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx * speedFactor;
        p.y += p.vy * speedFactor;
        p.life -= 0.02 * speedFactor;
        if (p.life <= 0) state.particles.splice(i, 1);
      }

      if (state.player.isInvulnerable) {
        state.player.invulnerableTimer -= deltaTime;
        if (state.player.invulnerableTimer <= 0) {
          state.player.isInvulnerable = false;
        }
      }

      if (time - state.lastObstacleTime > Math.random() * 2000 + 1000) {
        const isFlying = Math.random() > 0.5;
        const obsSize = 40 * scale;
        state.obstacles.push({
          x: canvas.width,
          y: isFlying ? state.groundY - 140 * scale - Math.random() * 40 * scale : state.groundY - obsSize,
          width: obsSize,
          height: obsSize
        });
        state.lastObstacleTime = time;
      }

      if (time - state.lastCollectibleTime > Math.random() * 3000 + 2000) {
        const colSize = 35 * scale;
        state.collectibles.push({
          x: canvas.width,
          y: state.groundY - 80 * scale - Math.random() * 80 * scale,
          width: colSize,
          height: colSize,
          collected: false
        });
        state.lastCollectibleTime = time;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const shakeX = (Math.random() - 0.5) * state.shake;
      const shakeY = (Math.random() - 0.5) * state.shake;
      ctx.save();
      ctx.translate(shakeX, shakeY);

      // Draw Background based on level
      state.bgOffset -= state.speed * 0.5 * speedFactor;
      if (state.bgOffset <= -canvas.width) state.bgOffset = 0;
      
      const bgImgKey = state.level === 1 ? 'bg1' : state.level === 2 ? 'bg2' : state.level === 3 ? 'bg3' : 'bg4';
      const bgImg = imagesRef.current[bgImgKey];
      if (bgImg) {
        ctx.drawImage(bgImg, state.bgOffset, 0, canvas.width, canvas.height);
        ctx.drawImage(bgImg, state.bgOffset + canvas.width, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = state.level === 1 ? '#87CEEB' : state.level === 2 ? '#B0C4DE' : state.level === 3 ? '#4682B4' : '#FFB6C1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw Ground
      ctx.fillStyle = '#654321';
      ctx.fillRect(0, state.groundY, canvas.width, canvas.height - state.groundY);

      // Draw Player (Blinking if invulnerable)
      if (!state.player.isInvulnerable || Math.floor(time / 100) % 2 === 0) {
        const playerImg = state.hasCar ? imagesRef.current['car'] : imagesRef.current['player'];
        if (playerImg) {
          // Add a small 2px offset if it's a car to ensure it touches the ground
          const yOffset = state.hasCar ? 2 : 0;
          ctx.drawImage(playerImg, state.player.x, state.player.y + yOffset, state.player.width, state.player.height);
        } else {
          ctx.fillStyle = state.hasCar ? '#1E90FF' : '#FF69B4';
          ctx.fillRect(state.player.x, state.player.y, state.player.width, state.player.height);
        }
      }

      // Update and Draw Obstacles
      for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        obs.x -= state.speed * speedFactor;

        const bookImg = imagesRef.current['book'];
        if (bookImg) {
          ctx.drawImage(bookImg, obs.x, obs.y, obs.width, obs.height);
        } else {
          ctx.fillStyle = '#FF4500';
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        }

        if (!state.player.isInvulnerable &&
            state.player.x < obs.x + obs.width &&
            state.player.x + state.player.width > obs.x &&
            state.player.y < obs.y + obs.height &&
            state.player.y + state.player.height > obs.y) {
          
          playSound('hit');
          state.lives -= 1;
          state.shake = 10;
          
          if (state.lives <= 0) {
            setIsGameOver(true);
            onGameOver(state.coupons, Math.floor(state.score));
            return;
          } else {
            state.player.isInvulnerable = true;
            state.player.invulnerableTimer = 2000;
          }
        }

        if (obs.x + obs.width < 0) {
          state.obstacles.splice(i, 1);
        }
      }

      // Update and Draw Collectibles
      for (let i = state.collectibles.length - 1; i >= 0; i--) {
        const col = state.collectibles[i];
        if (col.collected) continue;
        
        col.x -= state.speed * speedFactor;

        const couponImg = imagesRef.current['coupon'];
        if (couponImg) {
          ctx.drawImage(couponImg, col.x, col.y, col.width, col.height);
        } else {
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(col.x + col.width/2, col.y + col.height/2, col.width/2, 0, Math.PI * 2);
          ctx.fill();
        }

        if (state.player.x < col.x + col.width &&
            state.player.x + state.player.width > col.x &&
            state.player.y < col.y + col.height &&
            state.player.y + state.player.height > col.y) {
          
          playSound('coin');
          col.collected = true;
          state.coupons += 10;
          setCoupons(state.coupons);

          // Spawn particles
          for (let j = 0; j < 8; j++) {
            state.particles.push({
              x: col.x + col.width/2,
              y: col.y + col.height/2,
              vx: (Math.random() - 0.5) * 10,
              vy: (Math.random() - 0.5) * 10,
              life: 1.0,
              color: '#FFD700'
            });
          }
        }

        if (col.x + col.width < 0 || col.collected) {
          state.collectibles.splice(i, 1);
        }
      }

      // Draw Particles
      for (const p of state.particles) {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 4, 4);
      }
      ctx.globalAlpha = 1.0;

      ctx.restore();

      requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('mousedown', handleTouch);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isGameOver, onGameOver]);

  return (
    <div className="game-container">
      <div className="hud">
        <div className="hud-item">Kupon: {coupons}</div>
        <div className="hud-item lives">Can: {Math.max(0, gameStateRef.current.lives)}</div>
        <div className="hud-item">Skor: {score}</div>
      </div>
      <canvas ref={canvasRef} className="game-canvas" />
    </div>
  );
};

export default GameCanvas;

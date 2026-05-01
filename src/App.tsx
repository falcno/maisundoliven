import { useState, useEffect } from 'react';
import { type GameState, type PlayerData, type UpgradeId } from './types';
import { loadPlayerData, savePlayerData } from './utils/storage';
import ShopMenu from './components/ShopMenu';
import GameCanvas from './components/GameCanvas';
import './App.css';

function App() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);

  useEffect(() => {
    setPlayerData(loadPlayerData());
  }, []);

  const handleStartGame = () => {
    setGameState('PLAYING');
  };

  const handleGameOver = (collectedCoupons: number, newScore: number) => {
    if (!playerData) return;
    
    const updatedData = {
      ...playerData,
      coupons: playerData.coupons + collectedCoupons,
      highScore: Math.max(playerData.highScore, newScore),
    };
    
    setPlayerData(updatedData);
    savePlayerData(updatedData);
    setGameState('GAME_OVER');
  };

  const handleBackToMenu = () => {
    setGameState('MENU');
  };

  const handleBuyUpgrade = (cost: number, upgradeId: string) => {
    if (!playerData || playerData.coupons < cost) return;
    if (playerData.purchasedUpgrades.includes(upgradeId as UpgradeId)) return;

    const updatedData = {
      ...playerData,
      coupons: playerData.coupons - cost,
      purchasedUpgrades: [...playerData.purchasedUpgrades, upgradeId as UpgradeId]
    };
    
    setPlayerData(updatedData);
    savePlayerData(updatedData);
  };

  if (!playerData) return <div>Yükleniyor...</div>;

  return (
    <div className="app-container">
      {gameState === 'MENU' && (
        <ShopMenu 
          playerData={playerData} 
          onStart={handleStartGame} 
          onBuyUpgrade={handleBuyUpgrade} 
        />
      )}
      
      {gameState === 'PLAYING' && (
        <GameCanvas 
          playerData={playerData} 
          onGameOver={handleGameOver} 
        />
      )}

      {gameState === 'GAME_OVER' && (
        <div className="game-over-screen">
          <img src="/assets/angel.png" alt="Angel Boyfriend" className="angel-img" />
          <h1>OYUN BİTTİ</h1>
          <p>Sevgilin gelip seni kurtardı!</p>
          <div className="game-over-stats">
            <p>Mevcut Kuponlar: {playerData.coupons}</p>
            <p>En Yüksek Skor: {playerData.highScore}</p>
          </div>
          <button className="pixel-btn" onClick={handleBackToMenu}>
            Market'e Dön
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

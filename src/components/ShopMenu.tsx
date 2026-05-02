import React from 'react';
import { type PlayerData, UPGRADES } from '../types';
import './ShopMenu.css';

interface ShopMenuProps {
  playerData: PlayerData;
  onStart: () => void;
  onBuyUpgrade: (cost: number, id: string) => void;
}

const ShopMenu: React.FC<ShopMenuProps> = ({ playerData, onStart, onBuyUpgrade }) => {
  return (
    <div className="shop-menu">
      <div className="shop-header">
        <img src="/assets/shopkeep.png" alt="Shopkeeper" className="shopkeeper-img" />
        <div className="shop-header-text">
          <h1>DİLŞAD'IN İNDİRİM KOŞUSU</h1>
          <div className="coupon-balance">
            Kuponlar: <span className="highlight">{playerData.coupons}</span>
          </div>
        </div>
      </div>

      <div className="shop-items">
        {Object.values(UPGRADES).map((upgrade) => {
          const isPurchased = playerData.purchasedUpgrades.includes(upgrade.id);
          const canAfford = playerData.coupons >= upgrade.cost;

          return (
            <div key={upgrade.id} className={`shop-item ${isPurchased ? 'purchased' : ''}`}>
              <img src={upgrade.image} alt={upgrade.name} className="item-icon" />
              <div className="item-info">
                <h3>{upgrade.name}</h3>
                <p>{upgrade.description}</p>
              </div>
              
              {isPurchased ? (
                <div className="purchased-badge">Alındı</div>
              ) : (
                <button 
                  className="buy-btn"
                  disabled={!canAfford}
                  onClick={() => onBuyUpgrade(upgrade.cost, upgrade.id)}
                >
                  {upgrade.cost} Kupon
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="start-container">
        <button className="pixel-btn start-btn" onClick={onStart}>
          OYUNA BAŞLA
        </button>
        <p className="high-score">En Yüksek Skor: {playerData.highScore}</p>
      </div>
    </div>
  );
};

export default ShopMenu;

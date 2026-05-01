export type GameState = 'MENU' | 'PLAYING' | 'GAME_OVER';

export type UpgradeId = 'buket' | 'doner' | 'bilet' | 'araba';

export interface Upgrade {
  id: UpgradeId;
  name: string;
  cost: number;
  description: string;
  grantsExtraLife: boolean;
  grantsCarSprite: boolean;
}

export const UPGRADES: Record<UpgradeId, Upgrade> = {
  buket: {
    id: 'buket',
    name: 'Şakayık Buketi',
    cost: 50,
    description: '+1 Can',
    grantsExtraLife: true,
    grantsCarSprite: false,
  },
  doner: {
    id: 'doner',
    name: 'Bayramoğlu Döner',
    cost: 100,
    description: '+1 Can',
    grantsExtraLife: true,
    grantsCarSprite: false,
  },
  bilet: {
    id: 'bilet',
    name: 'Zara Larsson Bileti',
    cost: 150,
    description: '+1 Can',
    grantsExtraLife: true,
    grantsCarSprite: false,
  },
  araba: {
    id: 'araba',
    name: 'Mavi Suzuki Swift',
    cost: 300,
    description: '+1 Can ve Araç Görünümü',
    grantsExtraLife: true,
    grantsCarSprite: true,
  }
};

export interface PlayerData {
  coupons: number;
  purchasedUpgrades: UpgradeId[];
  highScore: number;
}

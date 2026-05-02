// Dilşad'ın İndirim Koşusu - Veri Yönetimi v2.1
import { type PlayerData } from '../types';

const STORAGE_KEY = 'dilsadoyun_save_data_v2';

const defaultData: PlayerData = {
  coupons: 0,
  purchasedUpgrades: [],
  highScore: 0,
};

export const loadPlayerData = (): PlayerData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return { ...defaultData, ...JSON.parse(data) };
    }
  } catch (error) {
    console.error('Failed to load player data:', error);
  }
  return { ...defaultData };
};

export const savePlayerData = (data: PlayerData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save player data:', error);
  }
};

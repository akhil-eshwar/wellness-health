import type { WellnessTip } from '../context/AppContext';

const FAVORITES_KEY = 'wellness-board-favorites';

export const storageUtils = {
  // Save favorites to localStorage
  saveFavorites: (favorites: WellnessTip[]): void => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  },

  // Get favorites from localStorage
  getFavorites: (): WellnessTip[] => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      return [];
    }
  },

  // Add a tip to favorites
  addToFavorites: (tip: WellnessTip): WellnessTip[] => {
    const favorites = storageUtils.getFavorites();
    // Check if tip is already in favorites to prevent duplicates
    const isAlreadyFavorite = favorites.some(fav => fav.id === tip.id);
    if (isAlreadyFavorite) {
      return favorites; // Return existing favorites without adding duplicate
    }
    const updatedFavorites = [...favorites, { ...tip, isFavorite: true }];
    storageUtils.saveFavorites(updatedFavorites);
    return updatedFavorites;
  },

  // Remove a tip from favorites
  removeFromFavorites: (tipId: string): WellnessTip[] => {
    const favorites = storageUtils.getFavorites();
    const updatedFavorites = favorites.filter(tip => tip.id !== tipId);
    storageUtils.saveFavorites(updatedFavorites);
    return updatedFavorites;
  },

  // Check if a tip is in favorites
  isFavorite: (tipId: string): boolean => {
    const favorites = storageUtils.getFavorites();
    return favorites.some(tip => tip.id === tipId);
  },

  // Clear all favorites
  clearFavorites: (): void => {
    try {
      localStorage.removeItem(FAVORITES_KEY);
    } catch (error) {
      console.error('Error clearing favorites from localStorage:', error);
    }
  },
};

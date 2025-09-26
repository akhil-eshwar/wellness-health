import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { storageUtils } from '../utils/storage';
import type { WellnessTip } from '../context/AppContext';

export const useFavorites = () => {
  const { state, dispatch } = useAppContext();

  // Load favorites from localStorage on app start
  const loadFavorites = useCallback(() => {
    const savedFavorites = storageUtils.getFavorites();
    dispatch({ type: 'SET_FAVORITES', payload: savedFavorites });
  }, [dispatch]);

  // Add tip to favorites
  const addToFavorites = useCallback((tip: WellnessTip) => {
    storageUtils.addToFavorites(tip);
    dispatch({ type: 'ADD_TO_FAVORITES', payload: tip });
  }, [dispatch]);

  // Remove tip from favorites
  const removeFromFavorites = useCallback((tipId: string) => {
    storageUtils.removeFromFavorites(tipId);
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: tipId });
  }, [dispatch]);

  // Toggle favorite status
  const toggleFavorite = useCallback((tip: WellnessTip) => {
    if (tip.isFavorite) {
      removeFromFavorites(tip.id);
    } else {
      addToFavorites(tip);
    }
  }, [addToFavorites, removeFromFavorites]);

  // Check if tip is favorite
  const isFavorite = useCallback((tipId: string) => {
    return state.favorites.some(tip => tip.id === tipId);
  }, [state.favorites]);

  return {
    favorites: state.favorites,
    loadFavorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
  };
};

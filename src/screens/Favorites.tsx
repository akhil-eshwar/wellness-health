import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/Card';
import { useFavorites } from '../hooks/useFavorites';

export const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const { removeFromFavorites } = useFavorites();

  const handleTipClick = (tip: any) => {
    dispatch({ type: 'SET_SELECTED_TIP', payload: tip });
    navigate('/tip-detail');
  };

  const handleRemoveFavorite = (e: React.MouseEvent, tipId: string) => {
    e.stopPropagation();
    removeFromFavorites(tipId);
  };

  if (state.favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">💔</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            No Favorites Yet
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Start adding tips to your favorites by clicking the heart icon on any tip!
          </p>
          <button
            onClick={() => navigate('/tips')}
            className="wellness-button"
          >
            Browse Tips
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Favorite Tips ❤️
          </h1>
          <p className="text-lg text-gray-600">
            {state.favorites.length} tip{state.favorites.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.favorites.map((tip) => (
            <Card
              key={tip.id}
              hover
              onClick={() => handleTipClick(tip)}
              className="relative"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{tip.icon}</div>
                <button
                  onClick={(e) => handleRemoveFavorite(e, tip.id)}
                  className="text-2xl text-red-500 hover:text-red-600 transition-colors duration-200"
                  title="Remove from favorites"
                >
                  ❤️
                </button>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {tip.title}
              </h3>
              
              <p className="text-gray-600 mb-3">
                {tip.shortDescription}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full font-medium">
                  {tip.category}
                </span>
                <span className="text-primary-600 text-sm font-medium">
                  Tap for details →
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

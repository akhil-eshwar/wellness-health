import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { AIService } from '../services/aiService';
import { Card } from '../components/Card';
import { useFavorites } from '../hooks/useFavorites';

export const TipsList: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const { toggleFavorite } = useFavorites();
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!state.profile.age || !state.profile.gender || !state.profile.wellnessGoal) {
      navigate('/');
      return;
    }

    // Always generate tips when profile changes, not just when tips array is empty
    generateTips();
  }, [state.profile.age, state.profile.gender, state.profile.wellnessGoal]);

  const generateTips = async () => {
    setIsGenerating(true);
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const tips = await AIService.generateWellnessTips(state.profile);
      dispatch({ type: 'SET_TIPS', payload: tips });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to generate tips' });
    } finally {
      setIsGenerating(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleTipClick = (tip: any) => {
    dispatch({ type: 'SET_SELECTED_TIP', payload: tip });
    navigate('/tip-detail');
  };

  const handleFavoriteClick = (e: React.MouseEvent, tip: any) => {
    e.stopPropagation();
    toggleFavorite(tip);
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Generating Your Personalized Tips...</h2>
          <p className="text-gray-600">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{state.error}</p>
          <button
            onClick={generateTips}
            className="wellness-button"
          >
            Try Again
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
            Your Personalized Wellness Tips 💡
          </h1>
          <p className="text-lg text-gray-600">
            Tap any tip to get detailed guidance and step-by-step advice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.tips.map((tip) => (
            <Card
              key={tip.id}
              hover
              onClick={() => handleTipClick(tip)}
              className="relative"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{tip.icon}</div>
                <button
                  onClick={(e) => handleFavoriteClick(e, tip)}
                  className={`text-2xl transition-colors duration-200 ${
                    tip.isFavorite ? 'text-red-500' : 'text-gray-300 hover:text-red-400'
                  }`}
                >
                  {tip.isFavorite ? '❤️' : '🤍'}
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

        <div className="text-center mt-8">
          <button
            onClick={generateTips}
            className="wellness-button"
            disabled={isGenerating}
          >
            Generate New Tips ✨
          </button>
        </div>
      </div>
    </div>
  );
};
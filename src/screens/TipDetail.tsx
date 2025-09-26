import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { AIService } from '../services/aiService';
import { Card } from '../components/Card';
import { useFavorites } from '../hooks/useFavorites';

export const TipDetail: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const { toggleFavorite } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!state.selectedTip) {
      navigate('/tips');
      return;
    }

    if (!state.selectedTip.detailedExplanation) {
      generateDetailedExplanation();
    }
  }, [state.selectedTip]);

  const generateDetailedExplanation = async () => {
    if (!state.selectedTip) return;

    setIsLoading(true);
    try {
      const details = await AIService.generateDetailedExplanation(
        state.selectedTip,
        state.profile
      );
      
      dispatch({
        type: 'UPDATE_TIP_DETAILS',
        payload: {
          id: state.selectedTip.id,
          detailedExplanation: details.detailedExplanation,
          stepByStepAdvice: details.stepByStepAdvice,
        },
      });
    } catch (error) {
      console.error('Error generating detailed explanation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!state.selectedTip) {
    return null;
  }

  const handleFavoriteClick = () => {
    toggleFavorite(state.selectedTip!);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/tips')}
          className="mb-6 flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Back to Tips
        </button>

        <Card>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{state.selectedTip.icon}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {state.selectedTip.title}
                </h1>
                <p className="text-lg text-gray-600">
                  {state.selectedTip.shortDescription}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleFavoriteClick}
              className={`text-3xl transition-colors duration-200 ${
                state.selectedTip.isFavorite ? 'text-red-500' : 'text-gray-300 hover:text-red-400'
              }`}
            >
              {state.selectedTip.isFavorite ? '❤️' : '🤍'}
            </button>
          </div>

          <div className="flex items-center mb-6">
            <span className="inline-block bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full font-medium">
              {state.selectedTip.category}
            </span>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating detailed explanation...</p>
            </div>
          ) : (
            <>
              {state.selectedTip.detailedExplanation && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Why This Matters
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {state.selectedTip.detailedExplanation}
                  </p>
                </div>
              )}

              {state.selectedTip.stepByStepAdvice && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Step-by-Step Guide
                  </h2>
                  <div className="space-y-4">
                    {state.selectedTip.stepByStepAdvice.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

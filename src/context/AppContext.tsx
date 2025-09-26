import React, { createContext, useContext, useReducer, type ReactNode } from 'react';

// Types
export interface UserProfile {
  age: number | null;
  gender: 'male' | 'female' | 'other' | null;
  wellnessGoal: string;
}

export interface WellnessTip {
  id: string;
  title: string;
  shortDescription: string;
  icon: string;
  category: string;
  detailedExplanation?: string;
  stepByStepAdvice?: string[];
  isFavorite: boolean;
}

export interface AppState {
  profile: UserProfile;
  tips: WellnessTip[];
  selectedTip: WellnessTip | null;
  favorites: WellnessTip[];
  isLoading: boolean;
  error: string | null;
}

// Action types
export type AppAction =
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'SET_TIPS'; payload: WellnessTip[] }
  | { type: 'SET_SELECTED_TIP'; payload: WellnessTip | null }
  | { type: 'ADD_TO_FAVORITES'; payload: WellnessTip }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string }
  | { type: 'SET_FAVORITES'; payload: WellnessTip[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_TIP_DETAILS'; payload: { id: string; detailedExplanation: string; stepByStepAdvice: string[] } };

// Initial state
const initialState: AppState = {
  profile: {
    age: null,
    gender: null,
    wellnessGoal: '',
  },
  tips: [],
  selectedTip: null,
  favorites: [],
  isLoading: false,
  error: null,
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    
    case 'SET_TIPS':
      return { ...state, tips: action.payload };
    
    case 'SET_SELECTED_TIP':
      return { ...state, selectedTip: action.payload };
    
    case 'ADD_TO_FAVORITES':
      // Check if tip is already in favorites to prevent duplicates
      const isAlreadyInFavorites = state.favorites.some(fav => fav.id === action.payload.id);
      if (isAlreadyInFavorites) {
        return state; // Return current state without changes
      }
      
      const updatedTipsAdd = state.tips.map(tip =>
        tip.id === action.payload.id ? { ...tip, isFavorite: true } : tip
      );
      return {
        ...state,
        tips: updatedTipsAdd,
        favorites: [...state.favorites, { ...action.payload, isFavorite: true }],
      };
    
    case 'REMOVE_FROM_FAVORITES':
      const updatedTipsRemove = state.tips.map(tip =>
        tip.id === action.payload ? { ...tip, isFavorite: false } : tip
      );
      return {
        ...state,
        tips: updatedTipsRemove,
        favorites: state.favorites.filter(tip => tip.id !== action.payload),
      };
    
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'UPDATE_TIP_DETAILS':
      const updatedTips = state.tips.map(tip =>
        tip.id === action.payload.id
          ? {
              ...tip,
              detailedExplanation: action.payload.detailedExplanation,
              stepByStepAdvice: action.payload.stepByStepAdvice,
            }
          : tip
      );
      const updatedSelectedTip = state.selectedTip?.id === action.payload.id
        ? {
            ...state.selectedTip,
            detailedExplanation: action.payload.detailedExplanation,
            stepByStepAdvice: action.payload.stepByStepAdvice,
          }
        : state.selectedTip;
      
      return {
        ...state,
        tips: updatedTips,
        selectedTip: updatedSelectedTip,
      };
    
    default:
      return state;
  }
};

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
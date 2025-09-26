import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ProfileForm } from './screens/ProfileForm';
import { TipsList } from './screens/TipsList';
import { TipDetail } from './screens/TipDetail';
import { Favorites } from './screens/Favorites';
import { useFavorites } from './hooks/useFavorites';

const AppContent: React.FC = () => {
  const { loadFavorites } = useFavorites();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<ProfileForm />} />
        <Route path="/tips" element={<TipsList />} />
        <Route path="/tip-detail" element={<TipDetail />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;

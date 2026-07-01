import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Dashboard from './features/Dashboard';
import ProviderDashboard from './features/ProviderDashboard';
import ProviderProfile from './features/ProviderProfile';
import BookingsManager from './features/BookingsManager';

const HomeSwitcher = () => {
  const { user } = useAuth();
  if (user?.role === 'provider') return <ProviderDashboard />;
  return <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Header />
        <main className="container" style={{ paddingBottom: '40px' }}>
          <Routes>
            <Route path="/" element={<HomeSwitcher />} />
            <Route path="/provider/:id" element={<ProviderProfile />} />
            <Route path="/bookings" element={<BookingsManager />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;

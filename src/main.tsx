import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { KeyboardProvider } from './contexts/KeyboardContext';
import App from './App.tsx';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SavedTextsPage } from './pages/SavedTextsPage';
import { AdminPage } from './pages/AdminPage';
import './index.css';

function RootApp() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [showSavedTexts, setShowSavedTexts] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Učitavanje...</div>
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <RegisterPage onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginPage onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  if (showAdmin) {
    return <AdminPage onBack={() => setShowAdmin(false)} />;
  }

  if (showSavedTexts) {
    return <SavedTextsPage onBack={() => setShowSavedTexts(false)} />;
  }

  return <App onShowSavedTexts={() => setShowSavedTexts(true)} onShowAdmin={() => setShowAdmin(true)} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <KeyboardProvider>
        <RootApp />
      </KeyboardProvider>
    </AuthProvider>
  </StrictMode>
);

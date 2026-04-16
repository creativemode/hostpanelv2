import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Domains } from './pages/Domains';
import { Databases } from './pages/Databases';
import { Backups } from './pages/Backups';

function AppContent() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F10] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Initializing System...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'domains': return <Domains />;
      case 'databases': return <Databases />;
      case 'backups': return <Backups />;
      default: return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center border border-gray-800">
             <span className="text-2xl">⏳</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight italic uppercase">Under Construction</h2>
          <p className="text-gray-500 font-serif italic max-w-xs mx-auto">Module "{activePage}" protocol is being established. Deployment in progress.</p>
        </div>
      );
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}


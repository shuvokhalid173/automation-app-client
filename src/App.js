import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';

function App() {
  const [view, setView] = useState('dashboard');

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {view === 'dashboard' ? (
        <Dashboard onOpenSettings={() => setView('settings')} />
      ) : (
        <Settings onBack={() => setView('dashboard')} />
      )}
    </div>
  );
}

export default App;

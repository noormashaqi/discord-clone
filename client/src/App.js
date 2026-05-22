import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Chat from './components/Chat';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token  = localStorage.getItem('token');
    if (stored && token) setUser(JSON.parse(stored));
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('user',  JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return user
    ? <Chat user={user} onLogout={handleLogout} />
    : <Auth onLogin={handleLogin} />;
}

export default App;
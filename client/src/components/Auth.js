import React, { useState } from 'react';
import api from '../api';

export default function Auth({ onLogin }) {
  const [mode, setMode]     = useState('login');
  const [form, setForm]     = useState({ username: '', email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(''); setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload  = mode === 'login'
        ? { email: form.email, password: form.password }
        : form;
      const res = await api.post(endpoint, payload);
      onLogin(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="auth-logo">💬</div>
        <h1 className="auth-title">DiscordLite</h1>
        <p className="auth-sub">{mode === 'login' ? 'Welcome back!' : 'Create your account'}</p>

        {mode === 'register' && (
          <input className="auth-input" placeholder="Username"
            value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
        )}
        <input className="auth-input" placeholder="Email"
          type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="auth-input" placeholder="Password"
          type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()} />

        {error && <p className="auth-error">{error}</p>}

        <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Register'}
        </button>

        <p className="auth-switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            {mode === 'login' ? 'Register' : 'Log In'}
          </span>
        </p>
      </div>
    </div>
  );
}
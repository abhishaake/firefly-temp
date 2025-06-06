import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/workout.css';
import { useAuthStore } from '../store/authStore';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const setAuth = useAuthStore(state => state.setAuth);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/manage-classes', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://firefly-admin.cozmotech.ie/api/app/auth/signIn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.data?.token) { 
        setAuth(data.data.user, data.data.token);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1D1327', position: 'fixed', top: 0, left: 0 }}>
      {/* Loading bar at the top */}
      {loading && (
        <div style={{ width: '100%', height: 4, background: '#F3E8FF', position: 'fixed', top: 0, left: 0, zIndex: 1000 }}>
          <div style={{ width: '100%', height: '100%', background: '#A259FF', animation: 'loadingBar 1s linear infinite' }} />
          <style>{`
            @keyframes loadingBar {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </div>
      )}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(53,53,53,0.10)',
        padding: '40px 32px',
        minWidth: 380,
        maxWidth: 400,
        width: '100%',
        fontFamily: 'Lato, Arial, sans-serif',
      }}>
        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, textAlign: 'center', color: '#584769' }}>Welcome back!</div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#353535' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #E0E0E0',
                fontSize: 16,
                fontFamily: 'inherit',
                background: '#F9F5FD',
                color: '#353535',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#353535' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #E0E0E0',
                fontSize: 16,
                fontFamily: 'inherit',
                background: '#F9F5FD',
                color: '#353535',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 0',
              background: loading ? '#A259FF99' : '#A259FF',
              color: '#fff',
              fontWeight: 700,
              fontSize: 18,
              border: 'none',
              borderRadius: 8,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 8,
              transition: 'background 0.2s',
              boxShadow: '0 2px 8px rgba(53,53,53,0.08)',
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          {error && <div style={{ color: 'red', marginTop: 16, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
        </form>
      </div>
    </div>
  );
}; 
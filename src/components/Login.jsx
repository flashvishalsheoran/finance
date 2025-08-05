import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if role is specified in URL params
    const roleParam = searchParams.get('role');
    if (roleParam === 'admin' || roleParam === 'client') {
      setRole(roleParam);
    }
  }, [searchParams]);

  useEffect(() => {
    // Redirect if already logged in
    if (isLoggedIn) {
      navigate(role === 'admin' ? '/admin' : '/client');
    }
  }, [isLoggedIn, navigate, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      const success = login(username, password, role);
      
      if (success) {
        navigate(role === 'admin' ? '/admin' : '/client');
      } else {
        setError('Invalid credentials. Please try again.');
      }
      setLoading(false);
    }, 500);
  };

  const getDemoCredentials = () => {
    if (role === 'admin') {
      return { username: 'admin', password: 'admin123' };
    } else {
      return { username: 'vishal', password: 'vishal123' };
    }
  };

  const fillDemoCredentials = () => {
    const demo = getDemoCredentials();
    setUsername(demo.username);
    setPassword(demo.password);
  };

  return (
    <div className="section">
      <div className="container">
        <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <h2 className="text-center mb-3">
            {role === 'admin' ? 'Admin Login' : 'Client Login'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            {/* REMOVED: Login Type dropdown */}
            {/*
            <div className="form-group">
              <label className="form-label">Login Type</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="form-select"
              >
                <option value="client">👤 Client - Invest & Earn</option>
                <option value="admin">🔧 Admin - Manage Platform</option>
              </select>
            </div>
            */}

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                placeholder="Enter username"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div className="mb-2" style={{ color: 'var(--error)', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary w-full mb-2"
              disabled={loading}
            >
              {loading ? <span className="loading"></span> : 'Login'}
            </button>

            <button 
              type="button" 
              onClick={fillDemoCredentials}
              className="btn btn-secondary w-full"
            >
              Use Demo Credentials
            </button>
          </form>

          <div className="mt-3 p-2" style={{ background: 'var(--secondary-bg)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            <strong>Demo Credentials:</strong><br />
            Admin: admin / admin123<br />
            Client: vishal / vishal123
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
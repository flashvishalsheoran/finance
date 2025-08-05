import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">
            +1 ULTIMATE
          </Link>
          
          <div className="nav-links">
            {!isLoggedIn ? (
              <>
                <Link to="/login?role=admin" className="btn btn-secondary">
                  Admin Login
                </Link>
                <Link to="/login?role=client" className="btn btn-primary">
                  Client Login
                </Link>
              </>
            ) : (
              <>
                <span className="nav-user">
                  Welcome, {user.name}
                </span>
                {user.role === 'admin' && (
                  <Link to="/admin" className="btn btn-secondary">
                    Admin Panel
                  </Link>
                )}
                {user.role === 'client' && (
                  <Link to="/client" className="btn btn-secondary">
                    Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
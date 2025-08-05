import React, { createContext, useContext, useState } from 'react';
import { adminUsers, clientUsers } from './data/staticData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const login = (username, password, role) => {
    let foundUser = null;
    
    if (role === 'admin') {
      foundUser = adminUsers.find(u => u.username === username && u.password === password);
    } else if (role === 'client') {
      foundUser = clientUsers.find(u => u.username === username && u.password === password);
    }
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      setUserRole(foundUser.role);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      userRole,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
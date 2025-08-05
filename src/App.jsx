import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Homepage from './pages/Homepage';
import ClientDashboard from './pages/ClientDashboard';
import AdminPanel from './pages/Admin';
import Login from './components/Login';
import Navbar from './components/Navbar';
import { initializeDummyWithdrawalData } from './data/staticData';

const PrivateRoute = ({ children, roles }) => {
  const { isAuthenticated, userRole } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    initializeDummyWithdrawalData(); // Call the function here to initialize dummy data on app load
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/client-dashboard"
          element={
            <PrivateRoute roles={['client']}>
              <ClientDashboard />
            </PrivateRoute>
          }
        />
        <Route 
          path="/admin"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminPanel />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/client-dashboard" : "/"} />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <AppContent />
    </Router>
  </AuthProvider>
);

export default App;
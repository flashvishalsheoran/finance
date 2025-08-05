import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    const baseStyles = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1001,
      padding: 'var(--spacing-md) var(--spacing-lg)',
      borderRadius: 'var(--radius-md)',
      color: 'var(--primary-text)',
      fontWeight: '500',
      boxShadow: 'var(--shadow-lg)',
      transition: 'all 0.3s ease',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      minWidth: '300px',
      maxWidth: '400px'
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, var(--success), #00cc70)',
          border: '1px solid var(--success)'
        };
      case 'error':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, var(--error), #ff6b6b)',
          border: '1px solid var(--error)'
        };
      case 'warning':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, var(--warning), #ffd93d)',
          color: 'var(--primary-bg)',
          border: '1px solid var(--warning)'
        };
      case 'info':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, var(--accent-primary), #0099cc)',
          border: '1px solid var(--accent-primary)'
        };
      default:
        return baseStyles;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <div style={getToastStyles()}>
      <div className="flex items-center gap-2">
        <span style={{ fontSize: '1.2rem' }}>{getIcon()}</span>
        <span>{message}</span>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            marginLeft: 'auto',
            fontSize: '1.2rem',
            opacity: 0.7
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Toast manager hook
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );

  return { showToast, ToastContainer };
};

export default Toast;
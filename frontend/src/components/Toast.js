import React, { useEffect } from 'react';
import './Toast.css';

function Toast({ message, type = 'success', duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type} animate__animated animate__fadeInDown`}>
      <div className="toast-content">
        {type === 'success' && (
          <i className="bi bi-check-circle-fill toast-icon"></i>
        )}
        {type === 'error' && (
          <i className="bi bi-exclamation-circle-fill toast-icon"></i>
        )}
        <span className="toast-message">{message}</span>
      </div>
    </div>
  );
}

export default Toast;
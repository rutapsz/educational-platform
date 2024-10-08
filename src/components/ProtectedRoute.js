import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ token, element, openModal }) => {
  useEffect(() => {
    if (!token) {
      openModal('login');
    }
  }, [token, openModal]);

  if (!token) {
    return null;
  }

  return element;
};

export default ProtectedRoute;

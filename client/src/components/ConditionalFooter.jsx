import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Footer from './Footer';

const ConditionalFooter = () => {
  const { isAuthenticated } = useAuth();

  // Only show footer when user is NOT logged in
  if (isAuthenticated) {
    return null;
  }

  return <Footer />;
};

export default ConditionalFooter;

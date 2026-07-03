// components/routes/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import Loader from '../common/Loader/Loader';
import { Box, Typography, Button } from '@mui/material';

const ProtectedRoute = ({ children, requiredRoles = [], requiredPermissions = [] }) => {
  const { 
    isAuthenticated, 
    loading, 
    hasRole, 
    hasPermission,
    user,
    error 
  } = useAuth();
  const location = useLocation();

  // Add error boundary
  if (error) {
    console.error('Auth error in ProtectedRoute:', error);
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          Authentication Error
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.href = '/auth/login'}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  if (loading) {
    return <Loader message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const verificationStatus = localStorage.getItem('trakjobs_verification_status') || user?.verification_status;
  if (verificationStatus !== 'verified' && !['/verification-required', '/verification', '/verification-success'].includes(location.pathname)) {
    console.log('User not verified, redirecting to verification warning screen');
    return <Navigate to="/verification-required" replace />;
  }

  // Check roles if required
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => {
      try {
        return hasRole(role);
      } catch (err) {
        console.error('Error checking role:', err);
        return false;
      }
    });

    if (!hasRequiredRole) {
      console.log('User missing required roles');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check permissions if required
  if (requiredPermissions.length > 0) {
    const hasRequiredPermission = requiredPermissions.some(permission => {
      try {
        return hasPermission(permission);
      } catch (err) {
        console.error('Error checking permission:', err);
        return false;
      }
    });

    if (!hasRequiredPermission) {
      console.log('User missing required permissions');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import employeeAuthService from '../../features/employee-auth/services/employeeAuthService';

const EmployeeProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!employeeAuthService.isAuthenticated()) {
    return <Navigate to="/employee-login" state={{ from: location }} replace />;
  }

  return children;
};

export default EmployeeProtectedRoute;

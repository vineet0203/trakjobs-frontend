// features/auth/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import AuthLayout from '../components/ui/AuthLayout';
import DebouncedTextField from '../../../components/common/form/DebouncedTextField';
import PasswordField from '../../../components/common/form/PasswordField';
import { loginSchema } from '../schemas/validationSchemas';
import { useAuth } from '../hooks/useAuth';
import ErrorDialog from '../../../components/common/ErrorDialog';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roles = ['Customer', 'Employee', 'Vendor'];
  const { 
    login, 
    loading, 
    error, 
    validationErrors, 
    lastErrorCode,
    clearError 
  } = useAuth();
  
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [currentError, setCurrentError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  const [snackbarOpen, setSnackbarOpen] = useState(!!location.state?.message);
  const [selectedRole, setSelectedRole] = useState('');

  // Handle success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setSnackbarOpen(true);
      // Clear the state to prevent showing again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Handle Redux errors
  useEffect(() => {
    if (error) {
      if (lastErrorCode === 422) {
        // Validation errors - show snackbar
        setSnackbarOpen(true);
      } else {
        // Other errors - show dialog
        setCurrentError({
          response: {
            data: {
              message: error,
              code: lastErrorCode,
              errors: validationErrors
            }
          }
        });
        setErrorDialogOpen(true);
      }
    }
  }, [error, lastErrorCode, validationErrors]);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const role = values.role;
      const result = await login(values, role === 'Vendor' ? '/dashboard' : null);
      
      if (result) {
        if (role === 'Customer') {
          const customerAppUrl = import.meta.env.VITE_CUSTOMER_APP_URL || 'http://localhost:5175';
          const token = result?.access_token;
          if (token) {
            const separator = customerAppUrl.includes('?') ? '&' : '?';
            window.location.href = `${customerAppUrl}${separator}authToken=${encodeURIComponent(token)}`;
          } else {
            window.location.href = customerAppUrl;
          }
        } else if (role === 'Employee') {
          const employeeAppUrl = import.meta.env.VITE_EMPLOYEE_APP_URL || 'http://localhost:5174';
          const token = result?.access_token;
          if (token) {
            const separator = employeeAppUrl.includes('?') ? '&' : '?';
            window.location.href = `${employeeAppUrl}${separator}authToken=${encodeURIComponent(token)}`;
          } else {
            window.location.href = employeeAppUrl;
          }
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      console.error('Login error in component:', err);
      
      // Handle validation errors (422)
      if (err.code === 422 || err.status === 422) {
        // Set field errors from validation response
        const fieldErrors = err.errors || validationErrors;
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          setFieldError(field, Array.isArray(messages) ? messages[0] : messages);
        });
      } else {
        // For all other errors, the useEffect will handle showing dialog
        setCurrentError(err);
        setErrorDialogOpen(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleErrorAction = (action) => {
    if (action === 'reset-password') {
      navigate('/auth/forgot-password');
    } else if (action === 'contact-support') {
      window.location.href = 'mailto:support@example.com';
    } else if (action === 'retry') {
      setErrorDialogOpen(false);
      clearError();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    clearError();
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    clearError();
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole('');
    clearError();
  };

  return (
    <AuthLayout title={selectedRole ? `LOGIN as ${selectedRole}` : 'LOGIN'}>
      {/* Error Dialog for non-validation errors */}
      <ErrorDialog
        open={errorDialogOpen}
        onClose={() => {
          setErrorDialogOpen(false);
          clearError();
        }}
        error={currentError}
        onAction={handleErrorAction}
      />

      {/* Snackbar for validation errors and success messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={successMessage ? "success" : "error"}
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }}
        >
          {successMessage || error || 'Please check your input'}
        </Alert>
      </Snackbar>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          maxWidth: 500,
          mx: 'auto',
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
        }}
      >
        {!selectedRole ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {roles.map((role) => (
              <Button
                key={role}
                variant="contained"
                onClick={() => handleSelectRole(role)}
                sx={{
                  textTransform: 'none',
                  fontSize: '18px',
                  minHeight: '45px',
                  borderRadius: '8px',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)'
                  }
                }}
              >
                {role}
              </Button>
            ))}
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 2, textAlign: 'left' }}>
              <Button
                type="button"
                onClick={handleBackToRoleSelection}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  px: 0,
                  minWidth: 'auto'
                }}
              >
                Back
              </Button>
            </Box>

            <Formik
              initialValues={{
                email: '',
                password: '',
                role: selectedRole
              }}
              enableReinitialize
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
              validateOnChange={false}
              validateOnBlur={true}
            >
              {({ isSubmitting, errors, touched, handleChange, handleBlur, values }) => (
                <Form>
                  <input type="hidden" name="role" value={values.role} />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <DebouncedTextField
                      name="email"
                      type="email"
                      label="Email Address"
                      placeholder="Enter your email address"
                      value={values.email}
                      onChange={(value) => handleChange('email')(value)}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      required
                      size="medium"
                      disabled={loading}
                    />

                    <PasswordField
                      name="password"
                      label="Password"
                      placeholder="Enter your password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      required
                      size="medium"
                      disabled={loading}
                    />

                    <Box sx={{ textAlign: 'right', mt: -1 }}>
                      <Link
                        to="/auth/forgot-password"
                        style={{
                          color: '#1976d2',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        Forgot Password?
                      </Link>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting || loading}
                        sx={{
                          textTransform: 'none',
                          fontSize: '18px',
                          minWidth: '220px',
                          minHeight: '45px',
                          borderRadius: '8px',
                          boxShadow: 'none',
                          '&:hover': {
                            boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)'
                          }
                        }}
                      >
                        {loading || isSubmitting ? (
                          <CircularProgress size={25} color="inherit" />
                        ) : 'Login'}
                      </Button>
                    </Box>
                  </Box>
                </Form>
              )}
            </Formik>

            {selectedRole === 'Vendor' ? (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  If you haven't Registered yet?{' '}
                  <Link
                    to="/auth/register"
                    style={{
                      color: '#1976d2',
                      textDecoration: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Register Now
                  </Link>
                </Typography>
              </Box>
            ) : null}
          </>
        )}
      </Paper>
    </AuthLayout>
  );
};

export default Login;
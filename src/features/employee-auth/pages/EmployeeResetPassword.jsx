import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import AuthLayout from '../../auth/components/ui/AuthLayout';
import DebouncedTextField from '../../../components/common/form/DebouncedTextField';
import employeeAuthService from '../services/employeeAuthService';

const EmployeeResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const token = searchParams.get('token') || '';

  const validatePassword = () => {
    if (!password) return 'New password is required.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Reset token is missing from URL.');
      return;
    }

    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await employeeAuthService.resetPassword({ token, password });
      setSuccess(response?.message || 'Password reset successful.');
      setPassword('');
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="EMPLOYEE RESET PASSWORD">
      <Paper elevation={0} sx={{ p: 3, maxWidth: 500, mx: 'auto', borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          {success ? <Alert severity="success">{success}</Alert> : null}

          <DebouncedTextField
            name="password"
            type="password"
            label="New Password"
            placeholder="Enter new password"
            value={password}
            onChange={(value) => setPassword(value)}
            onBlur={() => setError(validatePassword())}
            error={Boolean(error)}
            helperText={error}
            required
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Button type="submit" variant="contained" disabled={loading} sx={{ textTransform: 'none', fontSize: '18px', minWidth: '220px', minHeight: '45px', borderRadius: '8px' }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Back to <Link to="/employee-login" style={{ color: '#1976d2', textDecoration: 'none' }}>Employee Login</Link>
          </Typography>
        </Box>
      </Paper>
    </AuthLayout>
  );
};

export default EmployeeResetPassword;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Paper, Typography, Alert } from '@mui/material';
import AuthLayout from '../../auth/components/ui/AuthLayout';
import DebouncedTextField from '../../../components/common/form/DebouncedTextField';
import employeeAuthService from '../services/employeeAuthService';

const EmployeeLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await employeeAuthService.login(form);
      navigate('/employee/dashboard', { replace: true });
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="EMPLOYEE LOGIN">
      <Paper elevation={0} sx={{ p: 3, maxWidth: 500, mx: 'auto', borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {apiError ? <Alert severity="error">{apiError}</Alert> : null}

          <DebouncedTextField
            name="email"
            type="email"
            label="Email"
            placeholder="Enter email"
            value={form.email}
            onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
            onBlur={validate}
            error={Boolean(errors.email)}
            helperText={errors.email}
            required
          />

          <DebouncedTextField
            name="password"
            type="password"
            label="Password"
            placeholder="Enter password"
            value={form.password}
            onChange={(value) => setForm((prev) => ({ ...prev, password: value }))}
            onBlur={validate}
            error={Boolean(errors.password)}
            helperText={errors.password}
            required
          />

          <Box sx={{ textAlign: 'right', mt: -1 }}>
            <Link to="/employee/forgot-password" style={{ color: '#1976d2', textDecoration: 'none', fontSize: '0.875rem' }}>
              Forgot Password?
            </Link>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Button type="submit" variant="contained" disabled={loading} sx={{ textTransform: 'none', fontSize: '18px', minWidth: '220px', minHeight: '45px', borderRadius: '8px' }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </AuthLayout>
  );
};

export default EmployeeLogin;

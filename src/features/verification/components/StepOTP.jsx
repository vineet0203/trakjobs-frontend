import React, { useState } from 'react';
import { Box, Button, Typography, TextField, Grid, Card, CardContent } from '@mui/material';
import { CheckCircle2 } from 'lucide-react';
import { verificationApi } from '../api/verificationApi';

export default function StepOTP({ data, onChange, onNext, onBack }) {
  const [loading, setLoading] = useState(false);

  // Email state
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);

  // WhatsApp state
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [phoneSent, setPhoneSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);

  const getRegisteredDetails = () => {
    // Try Vendor
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const u = JSON.parse(userStr);
      if (u.role === 'Vendor' || u.role === 'admin') {
        return { email: u.email, phone: u.mobile_number || u.phone };
      }
    }
    // Try Customer
    const customerStr = localStorage.getItem('customer_profile');
    if (customerStr) {
      const c = JSON.parse(customerStr);
      return { email: c.email, phone: c.phone || c.mobile_number };
    }
    // Try Employee
    const employeeStr = localStorage.getItem('employee_auth_employee');
    if (employeeStr) {
      const e = JSON.parse(employeeStr);
      return { email: e.email, phone: e.mobile_number || e.phone };
    }
    return { email: '', phone: '' };
  };

  const registered = getRegisteredDetails();

  // Handle Email OTP Dispatch
  const handleSendEmailOtp = async () => {
    setEmailError('');
    if (!emailInput.trim()) {
      setEmailError('Please enter an email address.');
      return;
    }

    setLoading(true);
    try {
      await verificationApi.sendOtp('email', { email: emailInput.trim() });
      setEmailSent(true);
      alert('Email verification code sent successfully.');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to send email code.';
      setEmailError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Email OTP Verification
  const handleVerifyEmailOtp = async () => {
    if (emailOtp.length !== 6) {
      alert('Please enter a 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verificationApi.verifyOtp(emailOtp);
      if (res.success) {
        setEmailVerified(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Email OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle WhatsApp OTP Dispatch
  const handleSendPhoneOtp = async () => {
    setPhoneError('');
    if (!phoneInput.trim()) {
      setPhoneError('Please enter a mobile number.');
      return;
    }

    setLoading(true);
    try {
      await verificationApi.sendOtp('whatsapp', { mobile_number: phoneInput.trim() });
      setPhoneSent(true);
      alert('WhatsApp verification code sent successfully.');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to send WhatsApp code.';
      setPhoneError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle WhatsApp OTP Verification
  const handleVerifyPhoneOtp = async () => {
    if (phoneOtp.length !== 6) {
      alert('Please enter a 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verificationApi.verifyOtp(phoneOtp);
      if (res.success) {
        setPhoneVerified(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'WhatsApp OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (emailVerified && phoneVerified) {
      onNext();
    } else {
      alert('Please verify both email and mobile number to proceed.');
    }
  };

  return (
    <Box>
      <Typography variant="body1" sx={{ color: '#64748B', mb: 4, textAlign: 'center' }}>
        Please verify the email address and mobile number associated with your account.
      </Typography>

      <Grid container spacing={3}>
        {/* Email Verification Card */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F2744', mb: 2 }}>
                Email Verification
              </Typography>
              
              {emailVerified ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 2 }}>
                  <CheckCircle2 color="#22C55E" size={24} />
                  <Typography variant="body1" sx={{ color: '#22C55E', fontWeight: 600 }}>
                    Verified Successfully
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <TextField
                    fullWidth
                    label="Enter registered email"
                    variant="outlined"
                    value={emailInput}
                    onChange={(e) => { setEmailInput(e.target.value); setEmailError(''); }}
                    error={!!emailError}
                    helperText={emailError}
                    disabled={emailSent}
                    sx={{ mb: 2 }}
                  />
                  {!emailSent ? (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleSendEmailOtp}
                      disabled={loading || !emailInput}
                      sx={{ bgcolor: '#0F2744', textTransform: 'none' }}
                    >
                      Send Email OTP
                    </Button>
                  ) : (
                    <Box>
                      <TextField
                        fullWidth
                        label="6-Digit Code"
                        variant="outlined"
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                        sx={{ mb: 2 }}
                      />
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleVerifyEmailOtp}
                        disabled={loading || emailOtp.length !== 6}
                        sx={{ bgcolor: '#22C55E', '&:hover': { bgcolor: '#16a34a' }, textTransform: 'none' }}
                      >
                        Verify Code
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* WhatsApp Verification Card */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F2744', mb: 2 }}>
                WhatsApp Verification
              </Typography>
              
              {phoneVerified ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 2 }}>
                  <CheckCircle2 color="#22C55E" size={24} />
                  <Typography variant="body1" sx={{ color: '#22C55E', fontWeight: 600 }}>
                    Verified Successfully
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <TextField
                    fullWidth
                    label="Enter registered mobile number"
                    variant="outlined"
                    value={phoneInput}
                    onChange={(e) => { setPhoneInput(e.target.value); setPhoneError(''); }}
                    error={!!phoneError}
                    helperText={phoneError}
                    disabled={phoneSent}
                    sx={{ mb: 2 }}
                  />
                  {!phoneSent ? (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleSendPhoneOtp}
                      disabled={loading || !phoneInput}
                      sx={{ bgcolor: '#0F2744', textTransform: 'none' }}
                    >
                      Send WhatsApp OTP
                    </Button>
                  ) : (
                    <Box>
                      <TextField
                        fullWidth
                        label="6-Digit Code"
                        variant="outlined"
                        value={phoneOtp}
                        onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ''))}
                        sx={{ mb: 2 }}
                      />
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleVerifyPhoneOtp}
                        disabled={loading || phoneOtp.length !== 6}
                        sx={{ bgcolor: '#22C55E', '&:hover': { bgcolor: '#16a34a' }, textTransform: 'none' }}
                      >
                        Verify Code
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{
            textTransform: 'none',
            color: '#64748B',
            borderColor: '#CBD5E1',
            '&:hover': { borderColor: '#94A3B8', bgcolor: '#F8FAFC' },
          }}
        >
          Back
        </Button>
        <Button
          onClick={handleNextStep}
          variant="contained"
          disabled={!emailVerified || !phoneVerified}
          sx={{
            textTransform: 'none',
            bgcolor: '#0F2744',
            '&:hover': { bgcolor: '#0A1B30' },
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

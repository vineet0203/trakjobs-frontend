import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { CheckCircle2 } from 'lucide-react';

export default function VerificationSuccess() {
  const navigate = useNavigate();

  const handleDone = () => {
    localStorage.setItem('trakjobs_verification_status', 'verified');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const token = localStorage.getItem('access_token');
    
    if (user?.role === 'Customer') {
      window.location.href = `http://localhost:5175/dashboard?authToken=${token}&verified=true`;
    } else if (user?.role === 'Employee') {
      window.location.href = `http://localhost:5174/dashboard?authToken=${token}&verified=true`;
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 480,
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 20px 25px -5px rgba(15, 39, 68, 0.05), 0 10px 10px -5px rgba(15, 39, 68, 0.02)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          bgcolor: 'background.paper',
        }}
      >
        <CardContent sx={{ p: 5, textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'rgba(34, 197, 94, 0.1)',
              color: '#22C55E',
              mb: 3,
            }}
          >
            <CheckCircle2 size={46} />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#0F2744',
              mb: 1.5,
              fontSize: '1.75rem',
            }}
          >
            Verification Completed!
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#64748B',
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            Your account has been successfully verified. You now have full access to the TrakJobs platform.
          </Typography>

          <Button
            variant="contained"
            onClick={handleDone}
            fullWidth
            sx={{
              height: 48,
              borderRadius: 2,
              fontSize: 14,
              fontWeight: 700,
              textTransform: 'none',
              bgcolor: '#0F2744',
              '&:hover': {
                bgcolor: '#0A1B30',
              },
            }}
          >
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

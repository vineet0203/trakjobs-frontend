import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { LockKeyhole } from 'lucide-react';

export default function VerificationRequired() {
  const navigate = useNavigate();

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
          overflow: 'visible',
          position: 'relative',
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
              bgcolor: 'rgba(255, 184, 0, 0.1)',
              color: '#FFB800',
              mb: 3,
            }}
          >
            <LockKeyhole size={40} />
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
            Account Verification Required
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#64748B',
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            Your account is not verified yet. Please complete the verification process to unlock all TrakJobs features.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate('/verification')}
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
            Verify My Account
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

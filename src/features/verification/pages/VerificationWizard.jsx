import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Stepper, Step, StepLabel, Divider, CircularProgress } from '@mui/material';
import StepPersonal from '../components/StepPersonal';
import StepContact from '../components/StepContact';
import StepAddress from '../components/StepAddress';
import StepIdentity from '../components/StepIdentity';
import StepOTP from '../components/StepOTP';
import StepReview from '../components/StepReview';
import { verificationApi } from '../api/verificationApi';

const steps = [
  'Personal Information',
  'Contact Details',
  'Address Info',
  'Identity Document',
  'OTP Verification',
  'Final Review',
];

export default function VerificationWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await verificationApi.getProgress();
        if (res.success && res.data) {
          // current_step returned from backend is 1-indexed, convert to 0-indexed for Stepper
          setCurrentStep(Math.max(0, (res.data.current_step || 1) - 1));
          setFormData(res.data.verification_data || {});
        }
      } catch (err) {
        console.error('Error fetching verification progress:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, []);

  const handleDataChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      const nextStepIndex = currentStep + 1; // e.g. if current is 0, next is 1 (index), which is step 2
      // Save step to backend (Step is 1-indexed on backend)
      const res = await verificationApi.saveProgress(currentStep + 1, formData);

      if (nextStepIndex >= steps.length) {
        // Automatically verified upon step 6 submission
        localStorage.setItem('trakjobs_verification_status', 'verified');
        navigate('/verification-success');
      } else {
        setCurrentStep(nextStepIndex);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save progress.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleCancel = () => {
    navigate('/verification-required');
  };

  const renderActiveStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepPersonal
            data={formData}
            onChange={handleDataChange}
            onNext={handleNext}
            onCancel={handleCancel}
          />
        );
      case 1:
        return (
          <StepContact
            data={formData}
            onChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <StepAddress
            data={formData}
            onChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <StepIdentity
            data={formData}
            onChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <StepOTP
            data={formData}
            onChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <StepReview
            data={formData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F8FAFC' }}>
        <CircularProgress sx={{ color: '#0F2744' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Header */}
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #E2E8F0',
          py: 2,
          px: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              height: 36,
              width: 36,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
              background: '#0F2744',
              color: '#FFB800',
              fontWeight: 800,
            }}
          >
            T
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              color: '#0F2744',
              letterSpacing: '-0.025em',
            }}
          >
            Trak<span style={{ color: '#FFB800' }}>Jobs</span>
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>
          Step {currentStep + 1} of 6
        </Typography>
      </Box>

      {/* Main Layout Container */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          maxWidth: 1200,
          width: '100%',
          mx: 'auto',
          py: 6,
          px: 3,
          gap: 4,
        }}
      >
        {/* Left Sidebar Stepper */}
        <Box
          sx={{
            width: 280,
            display: { xs: 'none', md: 'block' },
            bgcolor: 'white',
            borderRadius: 3,
            p: 4,
            boxShadow: '0 4px 6px -1px rgba(15, 39, 68, 0.02)',
            height: 'fit-content',
            border: '1px solid #E2E8F0',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F2744', mb: 3 }}>
            VERIFICATION PROGRESS
          </Typography>
          <Stepper activeStep={currentStep} orientation="vertical" connector={null}>
            {steps.map((label, index) => (
              <Step key={label} sx={{ mb: 2 }}>
                <StepLabel
                  slotProps={{
                    label: {
                      style: {
                        fontWeight: currentStep === index ? 700 : 500,
                        color: currentStep === index ? '#0F2744' : '#94A3B8',
                      },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Right Content Form Area */}
        <Card
          sx={{
            flex: 1,
            borderRadius: 3,
            boxShadow: '0 4px 6px -1px rgba(15, 39, 68, 0.02)',
            border: '1px solid #E2E8F0',
            bgcolor: 'white',
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F2744', mb: 1 }}>
              {steps[currentStep]}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 4 }}>
              Please fill in your details to continue verification.
            </Typography>
            <Divider sx={{ mb: 4 }} />
            {renderActiveStep()}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

import React, { useState } from 'react';
import { Box, Button, Typography, Checkbox, FormControlLabel, Grid2, Divider } from '@mui/material';

export default function StepReview({ data, onNext, onBack }) {
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      alert('You must agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }
    onNext();
  };

  const sections = [
    {
      title: 'Personal Details',
      items: [
        { label: 'Full Name', value: `${data.firstName || ''} ${data.lastName || ''}` },
        { label: 'Date of Birth', value: data.dob },
        { label: 'Gender', value: data.gender },
      ],
    },
    {
      title: 'Contact Details',
      items: [
        { label: 'Email', value: data.email },
        { label: 'Phone', value: `${data.countryCode || ''} ${data.phone || ''}` },
      ],
    },
    {
      title: 'Address Info',
      items: [
        { label: 'Street', value: data.address },
        { label: 'City, State, Zip', value: `${data.city || ''}, ${data.state || ''} ${data.postalCode || ''}` },
        { label: 'Country', value: data.country },
      ],
    },
    {
      title: 'Uploaded Credentials',
      items: [
        { label: 'Document Type', value: data.idType?.toUpperCase().replace('_', ' ') },
        { label: 'File Name', value: data.fileName },
      ],
    },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
        {sections.map((section, idx) => (
          <Box key={idx}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F2744', mb: 1.5 }}>
              {section.title}
            </Typography>
            <Grid2 container spacing={2}>
              {section.items.map((item, itemIdx) => (
                <Grid2 size={{ xs: 12, sm: 6 }} key={itemIdx}>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                    {item.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F2744' }}>
                    {item.value || 'N/A'}
                  </Typography>
                </Grid2>
              ))}
            </Grid2>
            {idx < sections.length - 1 && <Divider sx={{ mt: 2.5 }} />}
          </Box>
        ))}
      </Box>

      <Box sx={{ mb: 4 }}>
        <FormControlLabel
          control={<Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)} color="primary" />}
          label={
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              I agree to the TrakJobs{' '}
              <a href="#" style={{ color: '#0F2744', fontWeight: 600 }}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" style={{ color: '#0F2744', fontWeight: 600 }}>
                Privacy Policy
              </a>
              .
            </Typography>
          }
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
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
          type="submit"
          variant="contained"
          sx={{
            textTransform: 'none',
            bgcolor: '#0F2744',
            '&:hover': { bgcolor: '#0A1B30' },
          }}
        >
          Submit Verification
        </Button>
      </Box>
    </form>
  );
}

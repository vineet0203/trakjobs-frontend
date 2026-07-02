import React from 'react';
import { Box, Button, TextField, MenuItem, Grid2 } from '@mui/material';

export default function StepContact({ data, onChange, onNext, onBack }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.email || !data.phone || !data.countryCode) {
      alert('Please fill out all required fields.');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            label="Email Address"
            type="email"
            value={data.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            required
            fullWidth
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <TextField
            select
            label="Country Code"
            value={data.countryCode || '+1'}
            onChange={(e) => onChange('countryCode', e.target.value)}
            required
            fullWidth
          >
            <MenuItem value="+1">+1 (US/Canada)</MenuItem>
            <MenuItem value="+91">+91 (India)</MenuItem>
            <MenuItem value="+44">+44 (UK)</MenuItem>
            <MenuItem value="+61">+61 (Australia)</MenuItem>
          </TextField>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 8 }}>
          <TextField
            label="Phone Number"
            value={data.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            required
            fullWidth
          />
        </Grid2>
      </Grid2>

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
          Next
        </Button>
      </Box>
    </form>
  );
}

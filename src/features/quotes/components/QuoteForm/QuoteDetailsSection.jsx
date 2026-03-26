// features/quotes/components/QuoteForm/QuoteDetailsSection.jsx
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Chip
} from '@mui/material';
import { Person, Business } from '@mui/icons-material';
import SectionHeader from '../../../../components/common/form/SectionHeader';
import DebouncedTextField from '../../../../components/common/form/DebouncedTextField';
import DebouncedSelect from '../../../../components/common/form/DebouncedSelect';
import CustomDatePicker from '../../../../components/common/CustomDatePicker';
import { QUOTE_STATUS_OPTIONS, CURRENCIES } from '../../constants/quoteConstants';

// Helper function to get client display name based on client type
const getClientDisplayName = (client) => {
  if (!client) return '';

  if (client.client_type === 'commercial') {
    return client.business_name || 'Unnamed Business';
  } else {
    const firstName = client.first_name || '';
    const lastName = client.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Unnamed Client';
  }
};

const QuoteDetailsSection = ({ formik, clients = [], loadingClients = false }) => {
  const [selectedClient, setSelectedClient] = useState(formik.values.client_id || '');
  
  // Check if we have a pre-selected client and it exists in the clients list
  // Use String() to handle type mismatch (client.id is number, formik value is string)
  const hasPreSelectedClient = formik.values.client_id && 
    clients.some(client => String(client.id) === String(formik.values.client_id));

  const handleClientChange = (event) => {
    const clientId = event.target.value;
    setSelectedClient(clientId);

    // Use String() to handle type mismatch (c.id is number, clientId from event is string)
    const client = clients.find(c => String(c.id) === String(clientId));

    if (client) {
      const displayName = getClientDisplayName(client);

      formik.setFieldValue('client_id', clientId);
      formik.setFieldValue('client_name', displayName);
      formik.setFieldValue('client_email', client.email || '');
      formik.setFieldTouched('client_id', true, false);
    } else {
      formik.setFieldValue('client_id', '');
      formik.setFieldValue('client_name', '');
      formik.setFieldValue('client_email', '');
    }
  };

  useEffect(() => {
    if (formik.values.client_id && formik.values.client_id !== selectedClient) {
      setSelectedClient(formik.values.client_id);
    }
  }, [formik.values.client_id]);

  // Determine if select should be disabled
  // Only disable if loading AND we don't have the pre-selected client yet
  const shouldDisableSelect = loadingClients && !hasPreSelectedClient;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        mb: 4,
        borderRadius: 2,
        backgroundColor: '#fff'
      }}
    >
      <SectionHeader number="1" title="Quote Details" />

      <Grid container spacing={3}>
        {/* Row 1: Quote Title and Quote Due Date */}
        <Grid item xs={12} md={6}>
          <DebouncedTextField
            name="title"
            label="Quote Title"
            value={formik.values.title}
            onChange={(value) => formik.setFieldValue('title', value)}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            required
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomDatePicker
            name="quote_due_date"
            label="Quote Due Date"
            placeholder="DD/MM/YYYY"
            value={formik.values.quote_due_date || ''}
            onChange={(value) => formik.setFieldValue('quote_due_date', value)}
            onBlur={() => formik.setFieldTouched('quote_due_date', true, true)}
            error={formik.touched.quote_due_date && Boolean(formik.errors.quote_due_date)}
            helperText={formik.touched.quote_due_date && formik.errors.quote_due_date}
          />
        </Grid>

        {/* Row 2: Client Selection and Quote Status */}
        <Grid item xs={12} md={6}>
          <FormControl
            fullWidth
            error={formik.touched.client_id && Boolean(formik.errors.client_id)}
            required
          >
            <InputLabel id="client-select-label">Select Client</InputLabel>
            <Select
              labelId="client-select-label"
              id="client-select"
              value={selectedClient}
              label="Select Client"
              onChange={handleClientChange}
              onBlur={() => formik.setFieldTouched('client_id', true)}
              disabled={shouldDisableSelect}
              renderValue={(selected) => {
                if (loadingClients && !hasPreSelectedClient) {
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} sx={{ color: '#3574BB' }} />
                      <Typography variant="body2" color="text.secondary">
                        Loading clients...
                      </Typography>
                    </Box>
                  );
                }
                
                if (!selected) return <em>Select a client</em>;
                // Use String() to handle type mismatch
                const client = clients.find(c => String(c.id) === String(selected));
                if (!client) return <em>Select a client</em>;

                const displayName = getClientDisplayName(client);
                const clientType = client.client_type === 'commercial' ? 'Commercial' : 'Residential';

                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: client.client_type === 'commercial' ? 'primary.main' : 'warning.main',
                        color: 'white'
                      }}
                    >
                      {client.client_type === 'commercial' ? <Business fontSize="small" /> : <Person fontSize="small" />}
                    </Avatar>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" component="span" sx={{ fontWeight: 500 }}>
                          {displayName}
                        </Typography>
                        <Chip
                          label={client.client_type === 'commercial' ? 'Commercial' : 'Residential'}
                          size="small"
                          color={client.client_type === 'commercial' ? 'primary' : 'warning'}
                          sx={{
                            height: 18,
                            '& .MuiChip-label': {
                              fontSize: '0.7rem',
                              px: 1,
                              lineHeight: 1,
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                );
              }}
            >
              {loadingClients && !hasPreSelectedClient ? (
                <MenuItem disabled>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: '#3574BB' }} />
                    <Typography variant="body2">Loading clients...</Typography>
                  </Box>
                </MenuItem>
              ) : (
                clients.map((client) => {
                  const displayName = getClientDisplayName(client);
                  const isCommercial = client.client_type === 'commercial';
                  const clientType = isCommercial ? 'Commercial' : 'Residential';

                  return (
                    <MenuItem key={client.id} value={client.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: isCommercial ? 'primary.main' : 'warning.main',
                            color: 'white'
                          }}
                        >
                          {isCommercial ? <Business fontSize="small" /> : <Person fontSize="small" />}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {displayName}
                            </Typography>
                            <Chip
                              label={clientType}
                              size="small"
                              color={isCommercial ? 'primary' : 'warning'}
                              sx={{
                                height: 20,
                                '& .MuiChip-label': {
                                  fontSize: '0.7rem',
                                  px: 1,
                                  lineHeight: 1,
                                },
                              }}
                            />
                          </Box>
                          {client.email && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                              {client.email}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </MenuItem>
                  );
                })
              )}
            </Select>
            {formik.touched.client_id && formik.errors.client_id && (
              <FormHelperText error>{formik.errors.client_id}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <DebouncedSelect
            name="status"
            label="Quote Status"
            value={formik.values.status}
            onChange={(value) => formik.setFieldValue('status', value)}
            onBlur={formik.handleBlur}
            error={formik.touched.status && Boolean(formik.errors.status)}
            helperText={formik.touched.status && formik.errors.status}
            options={QUOTE_STATUS_OPTIONS}
            fullWidth
          />
        </Grid>

        {/* Hidden fields for client data */}
        <input type="hidden" name="client_name" value={formik.values.client_name} />
        <input type="hidden" name="client_email" value={formik.values.client_email} />

        {/* Row 3: Currency only (full width) */}
        <Grid item xs={6}>
          <DebouncedSelect
            name="currency"
            label="Currency"
            value={formik.values.currency}
            onChange={(value) => formik.setFieldValue('currency', value)}
            onBlur={formik.handleBlur}
            error={formik.touched.currency && Boolean(formik.errors.currency)}
            helperText={formik.touched.currency && formik.errors.currency}
            options={CURRENCIES}
            required
            fullWidth
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default QuoteDetailsSection;
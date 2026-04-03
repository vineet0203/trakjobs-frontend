// features/quotes/components/QuoteForm/PricingSummarySection.jsx
import React, { useMemo } from 'react';
import { Box, Typography, Divider, Switch, TextField, Paper, MenuItem, Select } from '@mui/material';
import SectionHeader from '../../../../components/common/form/SectionHeader';
import { QUOTE_TAX_PERCENTAGE_OPTIONS } from '../../constants/quoteConstants';

const PricingSummarySection = ({ formik }) => {
  // Auto-calculate totals from line items
  const { subtotal, total } = useMemo(() => {
    const items = formik.values.line_items || [];
    const subtotal = items.reduce((sum, item) => {
      return sum + ((item.quantity || 0) * (item.unit_price || 0));
    }, 0);
    
    // Calculate total with tax from line items
    const total = items.reduce((sum, item) => {
      const itemSubtotal = (item.quantity || 0) * (item.unit_price || 0);
      const taxAmount = itemSubtotal * ((item.tax_rate || 0) / 100);
      return sum + itemSubtotal + taxAmount;
    }, 0);
    
    return { subtotal, total };
  }, [formik.values.line_items]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: formik.values.currency || 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid #e5e7eb',
        height: '100%'
      }}
    >
      <SectionHeader number="3" title="Pricing Summary" />

      {/* Subtotal - Auto-calculated */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
        <Typography>Subtotal</Typography>
        <Typography sx={{ fontWeight: 500 }}>{formatCurrency(subtotal)}</Typography>
      </Box>

      {/* Discount - User Input (could be expanded later) */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
        <Typography>Discount</Typography>
        <Typography sx={{ color: '#666' }}>$0.00</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Total Amount - Auto-calculated */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
        <Typography sx={{ fontWeight: 600 }}>Total Amount</Typography>
        <Typography sx={{ fontWeight: 600, color: '#183B59' }}>
          {formatCurrency(total)}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
        <Typography>Apply Tax?</Typography>
        <Switch
          checked={Boolean(formik.values.is_tax_applicable)}
          onChange={(e) => {
            const isApplicable = e.target.checked;
            formik.setFieldValue('is_tax_applicable', isApplicable);
            if (!isApplicable) {
              formik.setFieldValue('tax_percentage', 0);
            }
          }}
        />
      </Box>

      <Box sx={{ py: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Tax Percentage</Typography>
          <Select
            value={formik.values.tax_percentage ?? 0}
            onChange={(e) => formik.setFieldValue('tax_percentage', Number(e.target.value))}
            size="small"
            sx={{ width: 120 }}
            disabled={!formik.values.is_tax_applicable}
          >
            {QUOTE_TAX_PERCENTAGE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Deposit Required - User Input (Toggle) */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
        <Typography>Deposit Required</Typography>
        <Switch
          checked={formik.values.deposit_required}
          onChange={(e) => {
            formik.setFieldValue('deposit_required', e.target.checked);
            if (!e.target.checked) {
              formik.setFieldValue('deposit_amount', 0);
            }
          }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Deposit Amount - User Input (conditional) */}
      <Box sx={{ py: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Deposit Amount</Typography>
          {formik.values.deposit_required ? (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                type="number"
                value={formik.values.deposit_amount}
                onChange={(e) => formik.setFieldValue('deposit_amount', parseFloat(e.target.value) || 0)}
                size="small"
                sx={{ width: 100 }}
                inputProps={{ min: 0, max: 100, step: 5 }}
              />
              <Select
                value={formik.values.deposit_type}
                onChange={(e) => formik.setFieldValue('deposit_type', e.target.value)}
                size="small"
                sx={{ width: 100 }}
              >
                <MenuItem value="percentage">%</MenuItem>
                <MenuItem value="fixed">Fixed</MenuItem>
              </Select>
            </Box>
          ) : (
            <Typography sx={{ color: '#bbb' }}>-- / --</Typography>
          )}
        </Box>
        {formik.values.deposit_required && formik.values.deposit_type === 'percentage' && (
          <Typography variant="caption" sx={{ color: '#666', mt: 0.5, display: 'block' }}>
            Deposit amount: {formatCurrency((total * formik.values.deposit_amount) / 100)}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default PricingSummarySection;
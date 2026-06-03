import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
} from '@mui/material';
import quoteService from '../services/quoteService';

const FieldRow = ({ label, value }) => (
  <Grid container spacing={1} sx={{ mb: 1.5 }}>
    <Grid item xs={4}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Grid>
    <Grid item xs={8}>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value ?? '-'}
      </Typography>
    </Grid>
  </Grid>
);

const QuotePreviewModal = ({ open, quote, onClose, onEdit, onSuccess }) => {
  const [fullQuote, setFullQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  useEffect(() => {
    let isMounted = true;

    const loadQuote = async () => {
      if (!open || !quote?.id) return;

      setLoading(true);
      setError('');

      try {
        const response = await quoteService.getById(quote.id);
        if (isMounted) {
          setFullQuote(response);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load full quote details.');
          setFullQuote(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadQuote();

    return () => {
      isMounted = false;
    };
  }, [open, quote?.id]);

  const displayedQuote = fullQuote || quote;

  const quoteRows = displayedQuote?.items || [];

  const generalFields = useMemo(() => {
    if (!displayedQuote) return [];

    const excludedKeys = new Set([
      'id',
      'items',
      'reminders',
      'vendor',
      'client',
      'creator',
      'updater',
      'notes',
      'subtotal',
      'discount',
      'is_tax_applicable',
      'tax_percentage',
      'total_amount',
      'deposit_required',
      'deposit_type',
      'deposit_amount',
      'quote_number',
      'title',
      'client_name',
      'client_email',
      'quote_due_date',
      'currency',
      'approval_status',
      'client_signature',
      'customer_signature',
      'approval_date',
      'approval_action_date',
      'status',
      'sent_at',
      'can_convert_to_job',
      'is_converted',
      'job_id',
      'converted_at',
      'expires_at',
      'created_at',
      'updated_at',
      'can_edit',
      'can_send',
      'can_convert',
      'images',
    ]);

    return Object.entries(displayedQuote)
      .filter(([key, value]) => !excludedKeys.has(key) && value !== null && value !== undefined && value !== '')
      .map(([key, value]) => ({
        label: key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
        value: typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value),
      }));
  }, [displayedQuote]);

  const renderDetailValue = (value) => {
    if (value === null || value === undefined || value === '') return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') {
      return (
        <Typography component="pre" variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', m: 0 }}>
          {JSON.stringify(value, null, 2)}
        </Typography>
      );
    }
    return String(value);
  };

  if (!quote) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Quote Preview</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        ) : error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : (
          <>
            <FieldRow label="Quote #" value={displayedQuote.quote_number} />
            <FieldRow label="Title" value={displayedQuote.title} />
            <FieldRow label="Client" value={displayedQuote.client_name} />
            <FieldRow label="Client Email" value={displayedQuote.client_email} />
            <FieldRow label="Issue Date" value={formatDate(displayedQuote.created_at)} />
            <FieldRow label="Expiry Date" value={formatDate(displayedQuote.expires_at)} />
            <FieldRow label="Due Date" value={formatDate(displayedQuote.quote_due_date)} />
            <FieldRow label="Currency" value={displayedQuote.currency} />
            <FieldRow label="Subtotal" value={formatCurrency(displayedQuote.subtotal, displayedQuote.currency)} />
            <FieldRow label="Discount" value={formatCurrency(displayedQuote.discount, displayedQuote.currency)} />
            <FieldRow label="Tax Percentage" value={`${displayedQuote.tax_percentage ?? 0}%`} />
            <FieldRow label="Tax Applicable" value={displayedQuote.is_tax_applicable ? 'Yes' : 'No'} />
            <FieldRow label="Total Amount" value={formatCurrency(displayedQuote.total_amount, displayedQuote.currency)} />
            <FieldRow label="Deposit Required" value={renderDetailValue(displayedQuote.deposit_required)} />
            <FieldRow label="Deposit Type" value={renderDetailValue(displayedQuote.deposit_type)} />
            <FieldRow label="Deposit Amount" value={renderDetailValue(displayedQuote.deposit_amount)} />
            <FieldRow label="Approval Status" value={renderDetailValue(displayedQuote.approval_status)} />
            {displayedQuote.customer_signature && (
              <Box sx={{ mt: 1, mb: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Customer Signature</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <img src={displayedQuote.customer_signature} alt="Customer Signature" style={{ maxWidth: '300px', width: '100%', border: '1px solid #E5E7EB', borderRadius: '4px', background: '#fafafa', padding: '8px' }} />
                </Box>
              </Box>
            )}
            <FieldRow label="Sent At" value={formatDate(displayedQuote.sent_at)} />
            <FieldRow label="Status" value={displayedQuote.status} />

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
              Line Items / Services
            </Typography>

            {quoteRows.length > 0 ? (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quoteRows.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.item_name || '-'}</TableCell>
                      <TableCell>{item.description || '-'}</TableCell>
                      <TableCell align="right">{item.quantity ?? '-'}</TableCell>
                      <TableCell align="right">{formatCurrency(item.unit_price, displayedQuote.currency)}</TableCell>
                      <TableCell align="right">{formatCurrency(item.item_total, displayedQuote.currency)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No line items found.
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
              Notes / Terms
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {displayedQuote.notes || 'N/A'}
            </Typography>

            {displayedQuote.images && displayedQuote.images.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
                  Attached Images
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {displayedQuote.images.map((imgUrl, index) => (
                    <Box key={index} sx={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', maxWidth: '200px' }}>
                      <a href={imgUrl} target="_blank" rel="noopener noreferrer">
                        <img src={imgUrl} alt={`Attachment ${index + 1}`} style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} />
                      </a>
                    </Box>
                  ))}
                </Box>
              </>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
              Other Fields
            </Typography>

            {generalFields.length > 0 ? (
              generalFields.map((field) => (
                <FieldRow key={field.label} label={field.label} value={field.value} />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No additional fields found.
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              This is a read-only quote preview.
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        {displayedQuote?.status?.toLowerCase() === 'pending' && (
          <>
            <Button 
              color="error" 
              variant="outlined" 
              onClick={async () => {
                if (window.confirm('Are you sure you want to reject this lead/quote request?')) {
                  try {
                    await quoteService.rejectQuote(displayedQuote.id);
                    onSuccess?.();
                    onClose();
                  } catch (err) {
                    alert(err.message || 'Failed to reject quote.');
                  }
                }
              }}
            >
              Reject
            </Button>
            <Button 
              color="success" 
              variant="contained" 
              onClick={async () => {
                if (window.confirm('Are you sure you want to accept this lead/quote request?')) {
                  try {
                    await quoteService.acceptQuote(displayedQuote.id);
                    onSuccess?.();
                    onClose();
                  } catch (err) {
                    alert(err.message || 'Failed to accept quote.');
                  }
                }
              }}
            >
              Accept
            </Button>
          </>
        )}
        <Button onClick={onClose}>Close</Button>
        <Button onClick={() => onEdit?.(displayedQuote.id)} variant="contained" disabled={!displayedQuote.can_edit}>
          Edit Quote
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuotePreviewModal;

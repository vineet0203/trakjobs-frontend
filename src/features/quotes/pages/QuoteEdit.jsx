// features/quotes/pages/QuoteEdit.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Alert, Snackbar } from '@mui/material';
import { useQuotes } from '../hooks/useQuotes';
import { useClients } from '../../clients/hooks/useClients';
import { useToast } from '../../../components/common/ToastProvider';
import PageHeader from '../../../components/common/PageHeader';
import QuoteForm from '../components/QuoteForm/QuoteForm';
import PageLoader from '../../../components/common/Loader/PageLoader';
import CustomButton from '../../../components/common/CustomButton';

const QuoteEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getQuote, updateQuote, currentQuote, loading } = useQuotes();
  const { clients, loadClients, loading: clientsLoading } = useClients({ limit: 100 });
  const { showToast } = useToast();

  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch quote data on mount
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setIsFetching(true);
        setFetchError(false);
        console.log('📦 Fetching quote with ID:', id);
        await getQuote(id);
      } catch (error) {
        console.error('❌ Failed to fetch quote:', error);
        setFetchError(true);
        showToast('Failed to load quote data', 'error');
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchQuote();
    }
  }, [id, getQuote, showToast]);

  // Load clients for dropdown
  useEffect(() => {
    console.log('📦 Loading clients for dropdown...');
    loadClients(1, 100);
  }, [loadClients]);

  const handleSubmit = async (quoteData) => {
    console.log('🎯 handleSubmit called in QuoteEdit with data:', quoteData);
    setSubmitError(null);

    try {
      const formattedData = {
        ...quoteData,
        is_tax_applicable: Boolean(quoteData.is_tax_applicable),
        tax_percentage: quoteData.is_tax_applicable ? (parseInt(quoteData.tax_percentage, 10) || 0) : 0,
        line_items: quoteData.line_items?.map((item, index) => {
          const formattedItem = {
            ...item,
            unit_price: parseFloat(item.unit_price) || 0,
            quantity: parseInt(item.quantity) || 1,
            tax_rate: parseFloat(item.tax_rate) || 0,
            // Remove id if it's a new item (no id or id starts with 'temp')
            ...(item.id && !item.id.toString().startsWith('temp') ? { id: item.id } : {})
          };
          console.log(`📦 Formatted item ${index}:`, formattedItem);
          return formattedItem;
        }).filter(item => item.item_name && item.item_name.trim() !== '') || [],
        // Format reminders if any
        reminders: quoteData.reminders?.map(reminder => ({
          ...(reminder.id && !reminder.id.toString().startsWith('temp') ? { id: reminder.id } : {}),
          follow_up_schedule: reminder.follow_up_schedule,
          reminder_type: reminder.reminder_type,
          reminder_status: reminder.reminder_status || 'scheduled',
        })) || [],
      };

      // Remove client_name and client_email from the payload
      delete formattedData.client_name;
      delete formattedData.client_email;

      console.log('📤 Sending formatted data to updateQuote:', formattedData);
      const result = await updateQuote(id, formattedData);
      console.log('✅ updateQuote result:', result);

      showToast('Quote updated successfully!', 'success');

      // Navigate after short delay
      setTimeout(() => {
        navigate('/quotes');
      }, 1500);

    } catch (err) {
      console.error('❌ Error in handleSubmit:', err);
      const errorMessage = err.message || 'Failed to update quote';
      setSubmitError(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  const handleCancel = () => {
    navigate('/quotes');
  };

  const handleSaveAndSend = async (quoteData) => {
    console.log('📧 Save and Send clicked');
    // You can implement this to save and send email
    await handleSubmit({ ...quoteData, sendEmail: true });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Show loader while fetching
  if (isFetching) {
    return (
      <PageLoader message="Loading quote data..." size="lg" />
    );
  }

  // Show error if fetch failed
  if (fetchError || !currentQuote) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load quote data. The quote may not exist or you don't have permission to view it.
        </Alert>
        <CustomButton
          label="Back to Quotes"
          onClick={() => navigate('/quotes')}
        />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        breadcrumb={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Quotes', path: '/quotes' },
          { label: `Edit Quote #${currentQuote.quote_number || id}`, current: true }
        ]}
        title="Edit Quote"
        subtitle="Update the quote details below."
      />

      <QuoteForm
        onSubmit={handleSubmit}
        onSaveAndSend={handleSaveAndSend}
        isLoading={loading}
        submitError={submitError}
        clients={clients}
        loadingClients={clientsLoading}
        initialData={{...currentQuote, items: currentQuote?.items || currentQuote?.line_items || []}}
        isEditMode={true}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QuoteEdit;
// features/quotes/components/QuoteForm/QuoteForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Box, Grid, Paper, Divider, Alert } from '@mui/material';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import { quoteValidationSchema } from '../../schemas/validationSchemas';
import QuoteDetailsSection from './QuoteDetailsSection';
import QuoteLineItems from './QuoteLineItems';
import PricingSummarySection from './PricingSummarySection';
import ClientApprovalSection from './ClientApprovalSection';
import FollowUpRemindersSection from './FollowUpRemindersSection';
import ConversionToJobSection from './ConversionToJobSection';
import QuoteFormActions from './QuoteFormActions';
import { calculateQuoteTotals } from '../../utils/quoteTransformers';

// Watches for client_id changes and auto-populates tax_rate on line items
const ClientTaxSync = ({ formik, clients, isEditMode }) => {
  const prevClientIdRef = useRef(isEditMode ? formik.values.client_id : null);

  useEffect(() => {
    const currentClientId = formik.values.client_id;
    if (currentClientId && currentClientId !== prevClientIdRef.current) {
      const client = clients.find(c => String(c.id) === String(currentClientId));
      if (client) {
        const clientTax = parseFloat(client.tax_percentage) || 0;
        const clientTaxApplicable = Boolean(client.is_tax_applicable);

        formik.setFieldValue('is_tax_applicable', clientTaxApplicable);
        formik.setFieldValue('tax_percentage', clientTaxApplicable ? clientTax : 0);

        const updatedItems = formik.values.line_items.map(item => ({
          ...item,
          tax_rate: clientTax,
        }));
        formik.setFieldValue('line_items', updatedItems);
      }
    }
    prevClientIdRef.current = currentClientId;
  }, [formik.values.client_id]);

  return null;
};

const QuoteForm = ({
  initialData = {},
  onSubmit,
  isLoading = false,
  submitError = null,
  clients = [],
  loadingClients = false,
  isEditMode = false
}) => {
  const navigate = useNavigate();
  const [loadingAction, setLoadingAction] = useState(null);

  // ONLY snake_case field names - matching database
  const initialValues = {
    // Section 1: Quote Details
    title: initialData.title || '',
    client_id: initialData.client_id || '',
    status: initialData.status || 'draft',
    quote_due_date: initialData.quote_due_date || '',
    currency: initialData.currency || 'USD',

    // Section 2: Line Items
    line_items: (initialData.items && initialData.items.length > 0)
      ? initialData.items.map(item => ({
        id: item.id,
        item_name: item.item_name,
        description: item.description || '',
        quantity: item.quantity || 1,
        unit_price: item.unit_price || 0,
        tax_rate: item.tax_rate || 0,
        package_id: item.package_id || null,
      }))
      : isEditMode ? [] : [{
        item_name: '',
        description: '',
        quantity: 1,
        unit_price: 0,
        tax_rate: 0,
        package_id: null,
      }],

    // Section 3: Pricing Summary
    discount: initialData.discount || 0,
    is_tax_applicable: initialData.is_tax_applicable ?? false,
    tax_percentage: initialData.tax_percentage ?? 0,
    deposit_required: initialData.deposit_required ?? false,
    deposit_type: initialData.deposit_type || 'percentage',
    deposit_amount: initialData.deposit_amount || 50,

    // Section 4: Client Approval
    approval_status: initialData.approval_status || 'pending',
    client_signature: initialData.client_signature || '',
    approval_date: initialData.approval_date || null,
    approval_action_date: initialData.approval_action_date || null,

    // Section 5: Follow Ups & Reminders
    reminders: initialData.reminders?.map(reminder => ({
      id: reminder.id,
      follow_up_schedule: reminder.follow_up_schedule,
      reminder_type: reminder.reminder_type,
      reminder_status: reminder.reminder_status,
    })) || [],

    // Section 6: Conversion to Job
    can_convert_to_job: initialData.can_convert_to_job ?? true,
    job_id: initialData.job_id || '',
    converted_at: initialData.converted_at || null,

    // Meta
    notes: initialData.notes || '',
    expires_at: initialData.expires_at || null,
  };

  const calculateTotals = (values) => {
    return calculateQuoteTotals(values.line_items);
  };

  // Unified submit handler that handles both actions - LIKE CLIENT FORM
  const handleFormSubmit = async (values, formikHelpers) => {
    const { setSubmitting, validateForm } = formikHelpers;

    // Get the action from the values (set by the button click)
    const action = values._action || 'save';

    // Remove the temporary _action field
    const { _action, ...submitValues } = values;

    console.log("========== VALIDATING FORM ==========");

    // Validate form first
    const errors = await validateForm(submitValues);
    if (Object.keys(errors).length > 0) {
      console.log("❌ Validation errors:", errors);

      // Mark all fields as touched to show errors
      formikHelpers.setTouched({
        title: true,
        client_id: true,
        currency: true,
        line_items: submitValues.line_items.map((_, index) => ({
          item_name: true,
          quantity: true,
          unit_price: true
        }))
      }, true);

      setSubmitting(false);
      setLoadingAction(null);
      return;
    }

    console.log("========== FORM SUBMISSION PAYLOAD ==========");
    console.log("Form values:", submitValues);
    console.log("Action:", action);
    console.log("JSON Stringified:", JSON.stringify(submitValues, null, 2));
    console.log("==============================================");

    setLoadingAction(action);
    try {
      if (action === 'saveAndSend') {
        await onSubmit({ ...submitValues, send_email: true });
      } else {
        await onSubmit(submitValues);
      }
    } catch (error) {
      console.error('❌ Submit error:', error);
    } finally {
      setLoadingAction(null);
      setSubmitting(false);
    }
  };

  const handleSaveAndSend = () => {
    formik.setFieldValue('_action', 'saveAndSend');
    formik.submitForm();
  };

  const handleCancel = () => {
    navigate('/quotes');
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={quoteValidationSchema}
      onSubmit={handleFormSubmit}
      enableReinitialize
      validateOnChange={true}
      validateOnBlur={true}
      // Custom validate function to log errors - LIKE CLIENT FORM
      validate={(values) => {
        console.log("🔄 Validating quote values:", values);
        try {
          const schema = quoteValidationSchema;
          schema.validateSync(values, { abortEarly: false });
          console.log("✅ Validation passed");
          return {};
        } catch (err) {
          const errors = {};
          err.inner.forEach((error) => {
            errors[error.path] = error.message;
            console.log(`❌ Field ${error.path}: ${error.message}`);
          });
          return errors;
        }
      }}
    >
      {(formik) => {
        const totals = calculateTotals(formik.values);

        return (
          <Form>
            <ClientTaxSync formik={formik} clients={clients} isEditMode={isEditMode} />
            <Paper sx={{ p: 4, borderRadius: 2 }}>
              {submitError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {submitError}
                </Alert>
              )}

              {/* Section 1: Quote Details */}
              <QuoteDetailsSection
                formik={formik}
                clients={clients}
                loadingClients={loadingClients}
              />

              <Divider sx={{ my: 4 }} />

              {/* Section 2: Line Items */}
              <QuoteLineItems
                formik={formik}
                defaultTaxRate={
                  formik.values.client_id
                    ? parseFloat(clients.find(c => String(c.id) === String(formik.values.client_id))?.tax_percentage) || 0
                    : 0
                }
              />

              <Divider sx={{ my: 4 }} />

              {/* Sections 3 & 4 */}
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <PricingSummarySection
                      formik={formik}
                      subtotal={totals.subtotal}
                      total={totals.total}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ClientApprovalSection formik={formik} />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Sections 5 & 6 */}
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FollowUpRemindersSection formik={formik} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ConversionToJobSection formik={formik} />
                  </Grid>
                </Grid>
              </Box>

              {/* Form Actions */}
              <QuoteFormActions
                onCancel={handleCancel}
                isLoading={isLoading || loadingAction !== null}
                loadingAction={loadingAction}
                isEditMode={isEditMode}
                onSave={() => {
                  formik.setFieldValue('_action', 'save');
                  formik.submitForm();
                }}
                onSaveAndSend={handleSaveAndSend}
              />
            </Paper>
          </Form>
        );
      }}
    </Formik>
  );
};

export default QuoteForm;
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, TextField, Typography, FormControl, Select, MenuItem } from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PageHeader from '../../components/common/PageHeader';
import PageLoader from '../../components/common/Loader/PageLoader';
import invoiceService from './services/invoiceService';
import clientService from '../../features/clients/services/clientService';
import { mapInvoiceApiToPreviewData } from './utils/invoiceMappers';
import { useToast } from '../../components/common/ToastProvider';

const InvoicePreview = ({ invoiceId, onBackToList }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editableItems, setEditableItems] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [savingItems, setSavingItems] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [sendingInvoice, setSendingInvoice] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const rowJobNameRefs = useRef([]);
  const previousItemsCountRef = useRef(0);

  const invoiceData = useMemo(() => (invoice ? mapInvoiceApiToPreviewData(invoice) : null), [invoice]);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceId) return;

      try {
        setLoading(true);
        const data = await invoiceService.getById(invoiceId);
        setInvoice(data);
      } catch (error) {
        setInvoice(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await clientService.getAll({ per_page: 100, page: 1 });
        setClients(response.data || []);
      } catch (error) {
        console.error('Failed to load clients', error);
      }
    };

    fetchInvoice();
    fetchClients();
  }, [invoiceId]);

  useEffect(() => {
    if (!invoice?.items) {
      setEditableItems([]);
      return;
    }

    setEditableItems(
      invoice.items.map((item) => ({
        job_id: item?.job_id ?? '',
        job_name: item?.job_name ?? '',
        mileage: Number(item?.mileage || 0),
        other_expense: Number(item?.other_expense || 0),
        amount: Number(item?.amount || 0),
        vat: Number(item?.vat || 0),
      })),
    );
    if (invoice.client_id || invoice.client?.id) {
      setSelectedClientId(invoice.client_id || invoice.client?.id);
    }
  }, [invoice]);

  const {
    invoiceNumber,
    customer,
    billDate,
    deliveryDate,
    paymentDeadline,
    mileage,
    billingAddress,
    note,
    terms,
  } = invoiceData || {};

  const toNumber = (value) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return 0;
    return parsed < 0 ? 0 : parsed;
  };

  const round2 = (value) => Number(Number(value || 0).toFixed(2));

  const calculateVatValue = (item) => {
    const amount = toNumber(item.amount);
    const vatPercent = toNumber(item.vat);
    return round2((amount * vatPercent) / 100);
  };

  const calculateFinalAmount = (item) => {
    const amount = toNumber(item.amount);
    const mileageValue = toNumber(item.mileage);
    const otherExpense = toNumber(item.other_expense);
    const vatValue = calculateVatValue(item);
    return round2(amount + mileageValue + otherExpense + vatValue);
  };

  const handleItemChange = (index, field, value) => {
    setEditableItems((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        if (field === 'job_name') {
          return { ...item, [field]: value };
        }

        return { ...item, [field]: field === 'job_id' ? value : toNumber(value) };
      }),
    );
  };

  const handleAddRow = () => {
    setEditableItems((prev) => ([
      ...prev,
      {
        job_id: '',
        job_name: '',
        mileage: 0,
        other_expense: 0,
        amount: 0,
        vat: 0,
      },
    ]));
  };

  const handleDeleteRow = (index) => {
    if (!window.confirm('Are you sure you want to delete this row?')) {
      return;
    }

    setEditableItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  useEffect(() => {
    if (editableItems.length > previousItemsCountRef.current) {
      const lastIndex = editableItems.length - 1;
      requestAnimationFrame(() => {
        rowJobNameRefs.current[lastIndex]?.focus();
      });
    }

    previousItemsCountRef.current = editableItems.length;
  }, [editableItems.length]);

  const derivedTotals = useMemo(() => {
    const subtotal = round2(editableItems.reduce((sum, item) => sum + toNumber(item.amount), 0));
    const mileageTotal = round2(editableItems.reduce((sum, item) => sum + toNumber(item.mileage), 0));
    const otherExpenseTotal = round2(editableItems.reduce((sum, item) => sum + toNumber(item.other_expense), 0));
    const vatTotal = round2(editableItems.reduce((sum, item) => sum + calculateVatValue(item), 0));
    const grandTotal = round2(editableItems.reduce((sum, item) => sum + calculateFinalAmount(item), 0));

    return {
      subtotal,
      mileageTotal,
      otherExpenseTotal,
      vatTotal,
      grandTotal,
    };
  }, [editableItems]);

  const formatCurrency = (value) => Number(value || 0).toFixed(2);

  const handleSaveItems = async (silent = false) => {
    if (editableItems.length === 0) {
      setActionMessage('Please add at least one item before saving.');
      return;
    }

    try {
      setSavingItems(true);
      setActionMessage('');

      const payload = {
        client_id: selectedClientId || null,
        items: editableItems.map((item) => ({
          job_id: item.job_id === '' ? null : toNumber(item.job_id),
          job_name: item.job_name,
          mileage: round2(toNumber(item.mileage)),
          other_expense: round2(toNumber(item.other_expense)),
          amount: round2(toNumber(item.amount)),
          vat: round2(toNumber(item.vat)),
          final_amount: calculateFinalAmount(item),
        })),
      };

      const updatedInvoice = await invoiceService.update(invoiceId, payload);
      setInvoice(updatedInvoice);
      setActionMessage('Invoice items updated successfully.');
      if (!silent) {
        showToast('Invoice items updated successfully.', 'success');
      }
      return updatedInvoice;
    } catch (error) {
      setActionMessage(error?.response?.data?.message || 'Failed to update invoice items.');
      if (!silent) {
        showToast(error?.response?.data?.message || 'Failed to update invoice items.', 'error');
      }
      return null;
    } finally {
      setSavingItems(false);
    }
  };

  const handleSendInvoice = async () => {
    try {
      setSendingInvoice(true);
      setActionMessage('');

      await invoiceService.send(invoiceId, { email: recipientEmail });
      setActionMessage('Invoice sent successfully.');
      showToast('Invoice sent successfully.', 'success');
    } catch (error) {
      setActionMessage(error?.response?.data?.message || 'Failed to send invoice.');
      showToast(error?.response?.data?.message || 'Failed to send invoice.', 'error');
    } finally {
      setSendingInvoice(false);
    }
  };

  const handleGeneratePdf = async () => {
    const updated = await handleSaveItems(true);
    if (!updated) {
      showToast('Please fix invoice items before generating PDF.', 'error');
      return;
    }

    try {
      const freshInvoice = await invoiceService.getById(invoiceId);
      setInvoice(freshInvoice);
      navigate('/invoices/pdf-view', { state: { invoiceId } });
    } catch (error) {
      showToast('Failed to load latest invoice before PDF generation.', 'error');
    }
  };

  useEffect(() => {
    document.body.classList.add('invoice-preview-active');

    return () => {
      document.body.classList.remove('invoice-preview-active');
    };
  }, []);

  if (loading) {
    return (
      <Box className="invoice-preview-page">
        <PageLoader message="Loading invoice preview..." size="lg" />
      </Box>
    );
  }

  if (!invoiceData) {
    return (
      <Box className="invoice-preview-page">
        <Typography sx={{ p: 3 }}>Invoice not found.</Typography>
      </Box>
    );
  }

  return (
    <Box className="invoice-preview-page">
      <PageHeader
        breadcrumb={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Invoices', onClick: onBackToList },
          { label: 'Generate Invoice', current: true },
        ]}
        title={`Invoice ${invoiceNumber}`}
      />

      <Box className="invoice-preview-layout">
        <Box className="invoice-left-card">
          <Box className="invoice-profile-header">
            <Box className="invoice-profile-info">
              <Avatar src={customer.avatar} className="invoice-customer-avatar">
                {customer.name.charAt(0)}
              </Avatar>
              {invoice?.client ? (
                <Box className="invoice-customer-meta">
                  <Typography className="invoice-customer-name">
                    {customer.name}
                  </Typography>
                  <Typography className="invoice-customer-line">{customer.address}</Typography>
                  <Typography className="invoice-customer-line">{customer.contact}</Typography>
                </Box>
              ) : (
                <Box className="invoice-customer-meta" sx={{ width: 250 }}>
                  <Typography className="invoice-customer-name" sx={{ mb: 1, fontSize: 14 }}>
                    Select Client
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                    <Select value={selectedClientId || ''} onChange={(e) => setSelectedClientId(e.target.value)} displayEmpty>
                      <MenuItem value="" disabled>Select a client...</MenuItem>
                      {clients.map(c => <MenuItem key={c.id} value={c.id}>{c.name || c.business_name || (c.first_name + ' ' + c.last_name)}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Box>
              )}
            </Box>

            <Box className="invoice-header-right">
              <Box className="invoice-number-badge">
                {invoiceNumber}
              </Box>
              <Typography className="invoice-total-label">Total Amount</Typography>
              <Typography className="invoice-total-value">${formatCurrency(derivedTotals.grandTotal)}</Typography>
            </Box>
          </Box>

          <Box className="invoice-table-wrap">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Job ID</th>
                  <th>Job Name</th>
                  <th>Mileage</th>
                  <th>Other Expense</th>
                  <th>Amount</th>
                  <th>VAT</th>
                  <th>Final Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {editableItems.map((item, index) => (
                  <tr key={`invoice-item-${index}`}>
                    <td>{index + 1}</td>
                    <td>
                      <TextField
                        value={item.job_id}
                        onChange={(event) => handleItemChange(index, 'job_id', event.target.value)}
                        size="small"
                        fullWidth
                        inputProps={{ step: '1', min: 0 }}
                        className="invoice-cell-input"
                      />
                    </td>
                    <td>
                      <TextField
                        value={item.job_name}
                        onChange={(event) => handleItemChange(index, 'job_name', event.target.value)}
                        inputRef={(element) => {
                          rowJobNameRefs.current[index] = element;
                        }}
                        size="small"
                        fullWidth
                        className="invoice-cell-input"
                      />
                    </td>
                    <td>
                      <TextField
                        value={item.mileage}
                        onChange={(event) => handleItemChange(index, 'mileage', event.target.value)}
                        size="small"
                        fullWidth
                        className="invoice-cell-input"
                      />
                    </td>
                    <td>
                      <TextField
                        value={item.other_expense}
                        onChange={(event) => handleItemChange(index, 'other_expense', event.target.value)}
                        size="small"
                        fullWidth
                        className="invoice-cell-input"
                      />
                    </td>
                    <td>
                      <TextField
                        value={item.amount}
                        onChange={(event) => handleItemChange(index, 'amount', event.target.value)}
                        size="small"
                        fullWidth
                        className="invoice-cell-input"
                      />
                    </td>
                    <td>
                      <TextField
                        value={item.vat}
                        onChange={(event) => handleItemChange(index, 'vat', event.target.value)}
                        size="small"
                        fullWidth
                        className="invoice-cell-input"
                      />
                    </td>
                    <td>{calculateFinalAmount(item).toFixed(2)}</td>
                    <td>
                      <Button
                        color="error"
                        size="small"
                        onClick={() => handleDeleteRow(index)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 2 }}>
            <Button variant="outlined" onClick={handleAddRow}>
              + Add Row
            </Button>
            <Button variant="contained" onClick={handleSaveItems} disabled={savingItems}>
              {savingItems ? 'Saving...' : 'Save / Update'}
            </Button>
          </Box>

          <Box className="invoice-billing-card">
            <Box className="invoice-billing-grid">
              <Box className="invoice-date-card">
                <Typography className="invoice-section-label">Bill Date</Typography>
                <Typography className="invoice-date-value">{billDate}</Typography>

                <Typography className="invoice-section-label">Delivery Date</Typography>
                <Typography className="invoice-date-value">{deliveryDate}</Typography>

                <Typography className="invoice-section-label">Payment Deadline</Typography>
                <Typography className="invoice-date-value">{paymentDeadline}</Typography>

                <Typography className="invoice-section-label">Add Mileage</Typography>
                <Typography className="invoice-date-value invoice-date-mileage">${formatCurrency(derivedTotals.mileageTotal)}</Typography>

                <Typography className="invoice-section-label">Other Expense</Typography>
                <Typography className="invoice-date-value">${formatCurrency(derivedTotals.otherExpenseTotal)}</Typography>
              </Box>

              <Box className="invoice-address-wrap">
                <Typography className="invoice-section-label invoice-address-label">Billing Address</Typography>
                <Typography className="invoice-address-name">{billingAddress.name}</Typography>
                <Typography className="invoice-address-line">{billingAddress.street}</Typography>
                <Typography className="invoice-address-line invoice-address-contact">{billingAddress.contact}</Typography>

                <Typography className="invoice-section-label invoice-note-label">Note</Typography>
                <Typography className="invoice-note-text">{note}</Typography>
              </Box>
            </Box>
          </Box>

          <Box className="invoice-terms-wrap">
            <Typography className="invoice-section-label">Terms &amp; Conditions</Typography>
            <Typography className="invoice-terms-text">{terms}</Typography>
          </Box>
        </Box>

        <Box className="invoice-right-panel">
          <Box className="invoice-summary-card">
            <Typography className="invoice-summary-title">Summary</Typography>

            <Box className="invoice-summary-row">
              <Typography className="invoice-summary-key">Weekly Amount</Typography>
              <Typography className="invoice-summary-value">${formatCurrency(derivedTotals.subtotal)} Incl. VAT</Typography>
            </Box>

            <Box className="invoice-summary-row">
              <Typography className="invoice-summary-key">Milage</Typography>
              <Typography className="invoice-summary-value">${formatCurrency(derivedTotals.mileageTotal)}</Typography>
            </Box>

            <Box className="invoice-summary-row">
              <Typography className="invoice-summary-key">Other Expense</Typography>
              <Typography className="invoice-summary-value">${formatCurrency(derivedTotals.otherExpenseTotal)}</Typography>
            </Box>

            <Box className="invoice-summary-row">
              <Typography className="invoice-summary-key">VAT</Typography>
              <Typography className="invoice-summary-value">${formatCurrency(derivedTotals.vatTotal)}</Typography>
            </Box>

            <Box className="invoice-summary-total-row">
              <Typography className="invoice-summary-key invoice-summary-total-key">Total</Typography>
              <Box className="invoice-summary-total-badge">${formatCurrency(derivedTotals.grandTotal)} Incl. VAT</Box>
            </Box>
          </Box>

          <TextField
            placeholder="Enter Email ID"
            fullWidth
            value={recipientEmail}
            onChange={(event) => setRecipientEmail(event.target.value)}
            className="invoice-email-input"
          />

          <Button
            fullWidth
            variant="contained"
            startIcon={<SendOutlinedIcon />}
            className="invoice-send-btn"
            onClick={handleSendInvoice}
            disabled={sendingInvoice || recipientEmail.trim().length === 0}
          >
            {sendingInvoice ? 'Sending...' : 'Send Invoice'}
          </Button>

          <Button
            fullWidth
            variant="contained"
            startIcon={<ReceiptIcon />}
            className="invoice-generate-pdf-btn"
            onClick={handleGeneratePdf}
            sx={{ mt: 1 }}
            disabled={savingItems}
          >
            Generate PDF
          </Button>

          {actionMessage ? (
            <Typography sx={{ fontSize: 12, color: '#444b59', mt: 1 }}>
              {actionMessage}
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default InvoicePreview;
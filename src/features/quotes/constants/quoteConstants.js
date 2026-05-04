export const QUOTE_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending Approval' }
];

export const APPROVAL_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
];

export const EQUITY_STATUS_OPTIONS = [
  { value: 'not_applicable', label: 'Not Applicable' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'CAD', label: 'CAD ($)' },
  { value: 'AUD', label: 'AUD ($)' },
];

export const REMINDER_TYPES = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'notification', label: 'Notification' },
];

export const REMINDER_STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'sent', label: 'Sent' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const DEPOSIT_TYPE_OPTIONS = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'fixed', label: 'Fixed Amount' },
];

export const QUOTE_TAX_PERCENTAGE_OPTIONS = [
  { value: 0, label: '0%' },
  { value: 5, label: '5%' },
  { value: 12, label: '12%' },
  { value: 18, label: '18%' },
  { value: 28, label: '28%' },
];

export const QUOTE_SORT_OPTIONS = [
  { value: 'created_at', label: 'Date Created' },
  { value: 'quote_number', label: 'Quote Number' },
  { value: 'title', label: 'Title' },
  { value: 'client_name', label: 'Client Name' },
  { value: 'total_amount', label: 'Total Amount' },
  { value: 'expires_at', label: 'Expiry Date' },
];

export const QUOTE_FILTER_OPTIONS = {
  status: QUOTE_STATUS_OPTIONS,
  approval_status: APPROVAL_STATUS_OPTIONS,
  reminder_status: REMINDER_STATUS_OPTIONS,
};
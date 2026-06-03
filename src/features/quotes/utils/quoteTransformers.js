// utils/quoteTransformers.js

// Transform API response to frontend format - ONLY snake_case
export const transformQuoteFromApi = (apiQuote) => {
  return {
    id: apiQuote.id,
    quote_number: apiQuote.quote_number,
    title: apiQuote.title,
    client_id: apiQuote.client_id,
    client_name: apiQuote.client_name,
    client_email: apiQuote.client_email,
    quote_due_date: apiQuote.quote_due_date,
    currency: apiQuote.currency,

    // Pricing
    subtotal: parseFloat(apiQuote.subtotal),
    discount: parseFloat(apiQuote.discount || 0),
    is_tax_applicable: Boolean(apiQuote.is_tax_applicable),
    tax_percentage: parseInt(apiQuote.tax_percentage || 0, 10),
    total_amount: parseFloat(apiQuote.total_amount),
    deposit_required: apiQuote.deposit_required,
    deposit_type: apiQuote.deposit_type,
    deposit_amount: apiQuote.deposit_amount,

    // Approval
    approval_status: apiQuote.approval_status,
    client_signature: apiQuote.client_signature,
    customer_signature: apiQuote.customer_signature,
    approval_date: apiQuote.approval_date,
    approval_action_date: apiQuote.approval_action_date,

    // Status
    status: apiQuote.status,
    sent_at: apiQuote.sent_at,

    // Conversion
    can_convert_to_job: apiQuote.can_convert_to_job,
    is_converted: apiQuote.is_converted,
    job_id: apiQuote.job_id,
    converted_at: apiQuote.converted_at,

    // Dates
    expires_at: apiQuote.expires_at,
    created_at: apiQuote.created_at,
    updated_at: apiQuote.updated_at,

    // Relationships
    items: apiQuote.items?.map((item) => ({
      id: item.id,
      item_name: item.item_name,
      description: item.description,
      quantity: item.quantity,
      unit_price: parseFloat(item.unit_price),
      tax_rate: parseFloat(item.tax_rate),
      tax_amount: parseFloat(item.tax_amount),
      item_total: parseFloat(item.item_total),
      sort_order: item.sort_order,
      package_id: item.package_id,
    })) || [],

    reminders: apiQuote.reminders?.map((reminder) => ({
      id: reminder.id,
      follow_up_schedule: reminder.follow_up_schedule,
      reminder_type: reminder.reminder_type,
      reminder_status: reminder.reminder_status,
      sent_at: reminder.sent_at,
    })) || [],

    // Meta
    notes: apiQuote.notes,
    vendor: apiQuote.vendor,
    client: apiQuote.client,
    creator: apiQuote.creator,
    updater: apiQuote.updater,
    images: apiQuote.images || [],

    // Permissions
    can_edit: apiQuote.can_edit,
    can_send: apiQuote.can_send,
    can_convert: apiQuote.can_convert,
  };
};

// NO TRANSFORMATION NEEDED for API
export const transformQuoteForApi = (formData) => {
  return formData; // Just pass through - it's already snake_case
};

// Calculate totals from line items - MAKE SURE THIS IS EXPORTED
export const calculateQuoteTotals = (items, isTaxApplicable = false) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.quantity || 0) * (item.unit_price || 0);
  }, 0);

  const total = items.reduce((sum, item) => {
    const itemSubtotal = (item.quantity || 0) * (item.unit_price || 0);
    const taxAmount = isTaxApplicable ? itemSubtotal * ((item.tax_rate || 0) / 100) : 0;
    return sum + itemSubtotal + taxAmount;
  }, 0);

  return { subtotal, total };
};

// Format currency for display
export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date for display
export const formatDate = (date, format = "PP") => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get status color for UI
export const getQuoteStatusColor = (status) => {
  const statusMap = {
    draft: {
      bg: "#f3f4f6",
      color: "#6b7280",
      border: "#e5e7eb",
      label: "Draft",
    },
    sent: { bg: "#eef2ff", color: "#2563eb", border: "#c7d2fe", label: "Sent" },
    pending: {
      bg: "#fffbeb",
      color: "#b45309",
      border: "#fde68a",
      label: "Pending Approval",
    },
    accepted: {
      bg: "#ecfdf5",
      color: "#059669",
      border: "#a7f3d0",
      label: "Accepted",
    },
    rejected: {
      bg: "#fef2f2",
      color: "#dc2626",
      border: "#fecaca",
      label: "Rejected",
    },
    expired: {
      bg: "#fff7ed",
      color: "#ea580c",
      border: "#fed7aa",
      label: "Expired",
    },
  };
  return statusMap[status] || statusMap.draft;
};

// Get approval status color
export const getApprovalStatusColor = (status) => {
  const statusMap = {
    pending: { bg: "#fffbeb", color: "#b45309", label: "Pending" },
    accepted: { bg: "#ecfdf5", color: "#059669", label: "Accepted" },
    rejected: { bg: "#fef2f2", color: "#dc2626", label: "Rejected" },
  };
  return statusMap[status] || statusMap.pending;
};
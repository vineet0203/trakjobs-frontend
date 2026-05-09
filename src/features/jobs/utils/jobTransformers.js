// Transform API response to frontend format - snake_case
export const transformJobFromApi = (apiJob) => {
  return {
    id: apiJob.id,
    job_number: apiJob.job_number,
    title: apiJob.title,

    // Client info
    client_id: apiJob.client_id,
    client_name: apiJob.client_name,
    client_email: apiJob.client_email,
    client: apiJob.client, // Full client object if available

    // Quote reference
    quote_id: apiJob.quote_id,
    quote: apiJob.quote, // Full quote object if available
    quote_number: apiJob.quote_number,

    // Pricing
    total_amount: parseFloat(apiJob.total_amount || 0),
    is_invoiced: apiJob.is_invoiced || false,
    currency: apiJob.currency || "USD",

    // Dates
    issue_date: apiJob.issue_date,
    start_date: apiJob.start_date,
    end_date: apiJob.end_date,
    estimated_completion_date: apiJob.estimated_completion_date,

    // Status
    status: apiJob.status,
    work_type: apiJob.work_type,
    priority: apiJob.priority,

    // Content
    instructions: apiJob.instructions || "",
    notes: apiJob.notes || "",

    // Timestamps
    created_at: apiJob.created_at,
    updated_at: apiJob.updated_at,

    // Relationships
    assigned_to: apiJob.assigned_to,
    latest_assignment: apiJob.latest_assignment || null,
    created_by: apiJob.created_by,
    updated_by: apiJob.updated_by,

    tasks:
      apiJob.tasks?.map((task) => ({
        id: task.id,
        name: task.name,
        description: task.description,
        completed: task.completed || false,
        due_date: task.due_date,
        created_at: task.created_at,
        updated_at: task.updated_at,
      })) || [],

    attachments_by_context: apiJob.attachments_by_context || {},

    activities: apiJob.activities || [],

    // Stats
    stats: apiJob.stats || {
      total_tasks: apiJob.tasks?.length || 0,
      completed_tasks: apiJob.tasks?.filter((t) => t.completed).length || 0,
      pending_tasks: apiJob.tasks?.filter((t) => !t.completed).length || 0,
      total_attachments: 0,
      general_attachments: 0,
      instruction_attachments: 0,
    },

    // Permissions
    can_edit: apiJob.can_edit,
    can_delete: apiJob.can_delete,

    // Meta
    creator: apiJob.creator,
    updater: apiJob.updater,
  };
};

// Transform frontend data to API format (snake_case)
export const transformJobForApi = (formData) => {
  // Create a new object to avoid mutating the original
  const apiData = { ...formData };

  // Handle tasks if present
  if (apiData.tasks && Array.isArray(apiData.tasks)) {
    apiData.tasks = apiData.tasks.map((task) => ({
      name: task.name,
      description: task.description,
      due_date: task.due_date,
    }));
  }

  return apiData; // Already snake_case from form
};

// Get status color for UI
export const getJobStatusColor = (status) => {
  const statusMap = {
    pending: {
      bg: "#f3f4f6",
      color: "#6b7280",
      border: "#e5e7eb",
      label: "Pending",
    },
    scheduled: {
      bg: "#eef2ff",
      color: "#2563eb",
      border: "#c7d2fe",
      label: "Scheduled",
    },
    in_progress: {
      bg: "#fff7ed",
      color: "#9a3412",
      border: "#fed7aa",
      label: "In Progress",
    },
    on_hold: {
      bg: "#fef3c7",
      color: "#92400e",
      border: "#fde68a",
      label: "On Hold",
    },
    completed: {
      bg: "#ecfdf5",
      color: "#059669",
      border: "#a7f3d0",
      label: "Completed",
    },
    cancelled: {
      bg: "#fef2f2",
      color: "#dc2626",
      border: "#fecaca",
      label: "Cancelled",
    },
    archived: {
      bg: "#f3f4f6",
      color: "#4b5563",
      border: "#e5e7eb",
      label: "Archived",
    },
  };
  return statusMap[status] || statusMap.pending;
};

// Get work type color
export const getWorkTypeColor = (workType) => {
  const typeMap = {
    installation: { bg: "#ecfdf5", color: "#059669", label: "Installation" },
    repair: { bg: "#fef3c7", color: "#92400e", label: "Repair" },
    maintenance: { bg: "#eef2ff", color: "#2563eb", label: "Maintenance" },
    inspection: { bg: "#f3f4f6", color: "#6b7280", label: "Inspection" },
    consultation: { bg: "#f3e8ff", color: "#7e22ce", label: "Consultation" },
  };
  return (
    typeMap[workType] || { bg: "#f3f4f6", color: "#6b7280", label: workType }
  );
};

// Get priority color
export const getPriorityColor = (priority) => {
  const priorityMap = {
    low: { bg: "#ecfdf5", color: "#059669", label: "Low" },
    medium: { bg: "#fef3c7", color: "#92400e", label: "Medium" },
    high: { bg: "#fee2e2", color: "#b91c1c", label: "High" },
    urgent: { bg: "#fef2f2", color: "#b91c1c", label: "Urgent" },
  };
  return (
    priorityMap[priority] || {
      bg: "#f3f4f6",
      color: "#6b7280",
      label: priority,
    }
  );
};

// Format currency
export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (date, format = "PP") => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format datetime
export const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

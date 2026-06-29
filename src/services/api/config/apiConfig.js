// services/api/config/apiConfig.js
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // Set to true if using cookies
};

export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout",
    refresh: "/api/auth/refresh",
    forgotPassword: "/api/v1/auth/password/forgot",
    resetPassword: "/api/v1/auth/password/reset",
  },
  clients: {
    base: "/api/v1/vendors/clients", // Updated path
    get: (id) => `/api/v1/vendors/clients/${id}`, // Updated path
    create: "/api/v1/vendors/clients", // Updated path
    update: (id) => `/api/v1/vendors/clients/${id}`, // Updated path
    delete: (id) => `/api/v1/vendors/clients/${id}`, // Updated path
  },
  quotes: {
    base: "/api/v1/vendors/quotes",
    get: (id) => `/api/v1/vendors/quotes/${id}`,
    create: "/api/v1/vendors/quotes",
    update: (id) => `/api/v1/vendors/quotes/${id}`,
    delete: (id) => `/api/v1/vendors/quotes/${id}`,
    send: (id) => `/api/v1/vendors/quotes/${id}/send`,
  },
  jobs: {
    base: "/api/v1/vendors/jobs",
    get: (id) => `/api/v1/vendors/jobs/${id}`,
    create: "/api/v1/vendors/jobs",
    update: (id) => `/api/v1/vendors/jobs/${id}`,
    delete: (id) => `/api/v1/vendors/jobs/${id}`,
    status: (id) => `/api/v1/vendors/jobs/${id}/status`,
    number: (jobNumber) => `/api/v1/vendors/jobs/number/${jobNumber}`,
    tasks: {
      add: (jobId) => `/api/v1/vendors/jobs/${jobId}/tasks`,
      toggle: (jobId, taskId) =>
        `/api/v1/vendors/jobs/${jobId}/tasks/${taskId}/toggle`,
      delete: (jobId, taskId) =>
        `/api/v1/vendors/jobs/${jobId}/tasks/${taskId}`,
    },
    attachments: {
      add: (jobId) => `/api/v1/vendors/jobs/${jobId}/attachments`,
      delete: (jobId, attachmentId) =>
        `/api/v1/vendors/jobs/${jobId}/attachments/${attachmentId}`,
    },
    statistics: "/api/v1/vendors/jobs/statistics",
  },
  employees: {
    base: "/api/v1/vendors/employees",
    get: (id) => `/api/v1/vendors/employees/${id}`,
    create: "/api/v1/vendors/employees",
    update: (id) => `/api/v1/vendors/employees/${id}`,
    delete: (id) => `/api/v1/vendors/employees/${id}`,
    statistics: "/api/v1/vendors/employees/statistics",
    hierarchy: "/api/v1/vendors/employees/hierarchy",
    byDepartment: (department) =>
      `/api/v1/vendors/employees/department/${department}`,
    byDesignation: (designation) =>
      `/api/v1/vendors/employees/designation/${designation}`,
    subordinates: (employeeId) =>
      `/api/v1/vendors/employees/${employeeId}/subordinates`,
    managers: "/api/v1/vendors/employees/managers/options",
    
  },
  schedules: {
    base: "/api/v1/vendors/schedules",
    get: (id) => `/api/v1/vendors/schedules/${id}`,
    create: "/api/v1/vendors/schedules",
    update: (id) => `/api/v1/vendors/schedules/${id}`,
    delete: (id) => `/api/v1/vendors/schedules/${id}`,
  },
};

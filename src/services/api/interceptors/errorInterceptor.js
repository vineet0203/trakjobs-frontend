// services/api/interceptors/errorInterceptor.js
import axios from "axios";

export const errorInterceptor = async (error) => {
  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.error("[API Error]", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
  }

  // Handle specific error cases
  if (error.response) {
    const { status, data } = error.response;
    const isLoginEndpoint = error.config?.url?.includes('/api/v1/auth/login');

    switch (status) {
      case 401:
        // Don't redirect for login endpoint - just return the error
        if (isLoginEndpoint) {
          console.log('Login failed - showing error message');
          return Promise.reject(error);
        }
        return handleUnauthorized(error);

      case 403:
        return handleForbidden(error);

      case 422:
        return handleValidationError(error);

      case 429:
        return handleRateLimit(error);

      case 500:
        return handleServerError(error);

      default:
        return handleGenericError(error);
    }
  } else if (error.request) {
    // Network error - no response received
    return handleNetworkError(error);
  } else {
    // Request setup error
    return handleSetupError(error);
  }
};

// Update handleUnauthorized to be more careful
const handleUnauthorized = async (error) => {
  // Skip if we're already on login page or if this is a login request
  const isLoginPage = window.location.pathname.includes('/auth/login');
  const isLoginEndpoint = error.config?.url?.includes('/api/v1/auth/login');
  
  if (isLoginPage || isLoginEndpoint) {
    return Promise.reject(error);
  }

  // Try to refresh token
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      const response = await axios.post("/api/auth/refresh", {
        refresh_token: refreshToken,
      });

      localStorage.setItem("access_token", response.data.access_token);

      // Retry the original request
      error.config.headers.Authorization = `Bearer ${response.data.access_token}`;
      return axios(error.config);
    }
  } catch (refreshError) {
    // Refresh failed, logout user
    clearAuthData();
  }

  // No refresh token or refresh failed
  clearAuthData();
  
  // Only redirect if not already on login page
  if (!isLoginPage) {
    redirectToLogin();
  }
  
  return Promise.reject(error);
};

// Rest of the handlers remain the same
const handleForbidden = (error) => {
  const data = error.response?.data;
  if (data?.error_code === "VERIFICATION_REQUIRED" || (data?.code === 403 && data?.message?.includes("must be verified"))) {
    console.warn("Verification required - clearing stale verified status caches.");
    
    // Clear all possible verification caches
    localStorage.removeItem("trakjobs_verification_status");
    
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        userObj.verification_status = "pending";
        localStorage.setItem("user", JSON.stringify(userObj));
      } catch (e) {}
    }
    
    const customerStr = localStorage.getItem("customer_profile");
    if (customerStr) {
      try {
        const customerObj = JSON.parse(customerStr);
        customerObj.verification_status = "pending";
        localStorage.setItem("customer_profile", JSON.stringify(customerObj));
      } catch (e) {}
    }

    const employeeStr = localStorage.getItem("employee_auth_employee");
    if (employeeStr) {
      try {
        const employeeObj = JSON.parse(employeeStr);
        employeeObj.verification_status = "pending";
        localStorage.setItem("employee_auth_employee", JSON.stringify(employeeObj));
      } catch (e) {}
    }

    // Force route redirection to the warning screen
    if (!window.location.pathname.includes('/verification-required') && 
        !window.location.pathname.includes('/verification')) {
      window.location.href = "/verification-required";
    }
  }

  console.warn("Access forbidden:", error.response?.data?.message);
  return Promise.reject(error);
};

const handleValidationError = (error) => {
  const validationErrors = error.response?.data?.errors || {};
  error.validationErrors = validationErrors;
  return Promise.reject(error);
};

const handleRateLimit = (error) => {
  error.userMessage = "Too many requests. Please try again later.";
  return Promise.reject(error);
};

const handleServerError = (error) => {
  error.userMessage = "Server error. Please try again later.";
  return Promise.reject(error);
};

const handleNetworkError = (error) => {
  error.userMessage = "Network error. Please check your connection.";
  return Promise.reject(error);
};

const handleGenericError = (error) => {
  error.userMessage = "An unexpected error occurred.";
  return Promise.reject(error);
};

const handleSetupError = (error) => {
  error.userMessage = "Request configuration error.";
  return Promise.reject(error);
};

// Helper functions
const clearAuthData = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

const redirectToLogin = () => {
  if (!window.location.pathname.includes("/auth/login") && 
      !window.location.pathname.includes("/login")) {
    window.location.href = "/auth/login";
  }
};
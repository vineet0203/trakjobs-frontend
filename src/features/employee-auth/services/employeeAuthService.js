import { publicClient } from '../../../services/api/httpClient';

const EMPLOYEE_TOKEN_KEY = 'employee_token';
const EMPLOYEE_DATA_KEY = 'employee_auth_employee';

const getMessage = (error, fallback) => {
  return error?.response?.data?.message || error?.message || fallback;
};

const employeeAuthService = {
  async login(payload) {
    try {
      const response = await publicClient.post('/api/v1/employee/login', payload);
      const data = response?.data?.data || {};

      if (data.token) {
        localStorage.setItem(EMPLOYEE_TOKEN_KEY, data.token);
        localStorage.setItem(EMPLOYEE_DATA_KEY, JSON.stringify(data.employee || {}));
      }

      return response.data;
    } catch (error) {
      throw new Error(getMessage(error, 'Employee login failed.'));
    }
  },

  async forgotPassword(payload) {
    try {
      const response = await publicClient.post('/api/v1/employee/forgot-password', payload);
      return response.data;
    } catch (error) {
      throw new Error(getMessage(error, 'Failed to process forgot password request.'));
    }
  },

  async resetPassword(payload) {
    try {
      const response = await publicClient.post('/api/v1/employee/reset-password', payload);
      return response.data;
    } catch (error) {
      throw new Error(getMessage(error, 'Failed to reset password.'));
    }
  },

  logout() {
    localStorage.removeItem(EMPLOYEE_TOKEN_KEY);
    localStorage.removeItem(EMPLOYEE_DATA_KEY);
  },

  getToken() {
    return localStorage.getItem(EMPLOYEE_TOKEN_KEY);
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem(EMPLOYEE_TOKEN_KEY));
  },
};

export default employeeAuthService;

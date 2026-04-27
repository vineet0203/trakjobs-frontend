// features/auth/services/authService.js
import BaseApiService from "../../../services/api/baseApiService";

class AuthService extends BaseApiService {
  constructor() {
    super("auth");
  }

  async login(credentials) {
    try {
      console.log("AuthService.login called with:", credentials);
      const role = credentials?.role;
      let loginEndpoint = "/api/v1/auth/login";

      if (role === "Customer") {
        loginEndpoint = "/api/v1/customer/login";
      } else if (role === "Employee") {
        loginEndpoint = "/api/v1/employee/login";
      } else if (role === "Vendor") {
        loginEndpoint = "/api/v1/auth/login";
      }

      const response = await this.client.post(loginEndpoint, credentials);
      const responseData = response?.data?.data || {};

      let access_token;
      let user;
      let token_type;
      let expires_in;

      if (role === "Customer") {
        access_token = responseData.token;
        user = responseData.customer;
        token_type = responseData.token_type || "bearer";
        expires_in = responseData.expires_in;
      } else if (role === "Employee") {
        access_token = responseData.token;
        user = responseData.employee;
        token_type = responseData.token_type || "bearer";
        expires_in = responseData.expires_in;
      } else {
        access_token = responseData.access_token;
        user = responseData.user;
        token_type = responseData.token_type || "bearer";
        expires_in = responseData.expires_in;
      }
      
      if (access_token) {
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token_type", token_type || "bearer");
        if (expires_in) {
          localStorage.setItem("expires_in", expires_in);
        }
      }

      return {
        success: true,
        data: {
          access_token,
          user,
          role,
          token_type: token_type || "bearer",
          expires_in
        }
      };
    } catch (error) {
      console.error("Error in AuthService.login:", error);
      
      // THROW the error with full response data
      if (error.response) {
        const { status, data } = error.response;
        
        // Create error with the exact server response structure
        const serverError = new Error(data.message || "Login failed");
        serverError.response = {
          status,
          data: {
            success: false,
            message: data.message,
            timestamp: data.timestamp,
            code: data.code || status,
            error_code: data.error_code,
            errors: data.errors || {}
          }
        };
        serverError.code = data.code || status;
        serverError.message = data.message;
        
        throw serverError;
      }
      
      // Network error
      const networkError = new Error(error.message || "Network error");
      networkError.response = {
        status: 0,
        data: {
          success: false,
          message: "Network error. Please check your connection.",
          timestamp: new Date().toISOString(),
          code: 0,
          error_code: "NETWORK_ERROR"
        }
      };
      networkError.code = 0;
      
      throw networkError;
    }
  }

  async register(userData) {
    try {
      const response = await this.client.post("/api/v1/auth/register", userData);
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Registration successful"
      };
    } catch (error) {
      console.error("Error in AuthService.register:", error);
      
      if (error.response) {
        const serverError = new Error(error.response.data.message || "Registration failed");
        serverError.response = error.response;
        serverError.code = error.response.data.code || error.response.status;
        throw serverError;
      }
      throw error;
    }
  }

  async forgotPassword(email) {
    try {
      const response = await this.client.post("/auth/forgot-password", { email });
      
      return {
        success: true,
        message: response.data.message || "Password reset link sent successfully"
      };
    } catch (error) {
      console.error("Error in AuthService.forgotPassword:", error);
      
      if (error.response) {
        const serverError = new Error(error.response.data.message || "Failed to send reset email");
        serverError.response = error.response;
        serverError.code = error.response.data.code || error.response.status;
        throw serverError;
      }
      throw error;
    }
  }

  async resetPassword(data) {
    try {
      const response = await this.client.post("/auth/reset-password", data);
      
      return {
        success: true,
        message: response.data.message || "Password reset successful"
      };
    } catch (error) {
      console.error("Error in AuthService.resetPassword:", error);
      
      if (error.response) {
        const serverError = new Error(error.response.data.message || "Failed to reset password");
        serverError.response = error.response;
        serverError.code = error.response.data.code || error.response.status;
        throw serverError;
      }
      throw error;
    }
  }

  async logout() {
    try {
      await this.client.post("/auth/logout");
      this.clearAuthData();
      return { success: true, message: "Logout successful" };
    } catch (error) {
      console.error("Error in AuthService.logout:", error);
      this.clearAuthData();
      
      if (error.response) {
        const serverError = new Error(error.response.data?.message || "Logout failed");
        serverError.response = error.response;
        serverError.code = error.response.data?.code || error.response.status;
        throw serverError;
      }
      throw error;
    }
  }

  clearAuthData() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("token_type");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("email");
  }

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  isAuthenticated() {
    return !!localStorage.getItem("access_token");
  }
}

const authService = new AuthService();
export default authService;
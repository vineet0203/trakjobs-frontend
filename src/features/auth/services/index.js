import api from "../../../services/api/httpClient";

// export const login = async (credentials) => {
//   try {
//     const response = await api.post("api/v1/auth/login", credentials);

//     const { access_token, user } = response.data.data;

//     if (access_token) {
//       localStorage.setItem("access_token", access_token);
//       localStorage.setItem("user", JSON.stringify(user));
//     }

//     return response.data;
//   } catch (error) {
//     if (error.response?.data) {
//       // Check if there are validation errors
//       if (error.response.data.errors) {
//         throw { errors: error.response.data.errors };
//       }
//       // Otherwise throw the message
//       throw new Error(error.response.data.message || "Login failed");
//     }
//     throw error;
//   }
// };

export const register = async (userData) => {
  try {
    const response = await api.post("api/v1/auth/register", userData);
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      if (error.response.data.errors) {
        throw { errors: error.response.data.errors };
      }
      throw new Error(error.response.data.message || "Registration failed");
    }
    throw error;
  }
};

export const forgotPassword = async ({ email }) => {
  try {
    const response = await api.post("/api/v1/auth/password/forgot", { email });
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw new Error(
        error.response.data.message || "Failed to send reset link",
      );
    }
    throw error;
  }
};

export const resetPassword = async ({
  email,
  token,
  password,
  password_confirmation,
}) => {
  try {
    const response = await api.post("/api/v1/auth/password/reset", {
      email,
      token,
      password,
      password_confirmation,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw new Error(
        error.response.data.message || "Failed to reset password",
      );
    }
    throw error;
  }
};

// export const logout = () => {
//   localStorage.removeItem("access_token");
//   localStorage.removeItem("user");
// };

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle 401 responses
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       logout();
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   },
// );

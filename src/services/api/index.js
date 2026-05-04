// services/api/index.js
export {
  default as httpClient,
  publicClient,
  fileUploadClient,
} from "./httpClient";
export { default as BaseApiService } from "./baseApiService";
export { default as clientsService } from "./clientService";
export { default as quotesService } from "./quotesService";
export { default as fileUploadService } from "./fileUploadService";
export { API_ENDPOINTS } from "./config/apiConfig";

// Also export interceptors if needed elsewhere
export * from "./interceptors/requestInterceptor";
export * from "./interceptors/responseInterceptor";
export * from "./interceptors/errorInterceptor";

import BaseApiService from "../../../services/api/baseApiService";
import { API_ENDPOINTS } from "../../../services/api/config/apiConfig";

class CustomerService extends BaseApiService {
  constructor() {
    super("clients");
    this.endpoints = {
      ...this.endpoints,
      base: API_ENDPOINTS.clients.base,
      get: API_ENDPOINTS.clients.get,
      create: API_ENDPOINTS.clients.create,
      update: API_ENDPOINTS.clients.update,
      delete: API_ENDPOINTS.clients.delete,
    };
  }

  async getAll(params = {}) {
    const defaultParams = { vendor_id: this.getVendorId() };
    const response = await super.getAll({ ...defaultParams, ...params });
    return response.data || response;
  }

  async getById(id) {
    const response = await super.get(id);
    return response.data;
  }
}

const customerService = new CustomerService();
export default customerService;

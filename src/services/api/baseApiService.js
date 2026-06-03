// services/api/baseApiService.js
import httpClient from "./httpClient";

class BaseApiService {
  constructor(resource, options = {}) {
    this.resource = resource;
    this.client = httpClient;
  }

  // Get vendor ID from localStorage or store
  getVendorId() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.vendor_id;
  }

  // Build URL based on resource type
  buildUrl(path = "") {
    // Remove the duplicate resource by checking if path already starts with the resource
    if (path.startsWith(`/${this.resource}`)) {
      return `/api/v1/vendors${path}`;
    }
    return `/api/v1/vendors/${this.resource}${path}`;
  }

  // CRUD operations
  async getAll(params = {}) {
    const url = this.buildUrl();
    const response = await this.client.get(url, { params });
    return response.data;
  }

  async getById(id) {
    const url = this.buildUrl(`/${id}`);
    const response = await this.client.get(url);
    return response.data;
  }

  async create(data) {
    const url = this.buildUrl();
    const response = await this.client.post(url, data);
    return response.data;
  }

  async update(id, data) {
    const url = this.buildUrl(`/${id}`);
    console.log('🔥 API UPDATE PAYLOAD:', JSON.stringify(data, null, 2));
    const response = await this.client.put(url, data);
    return response.data;
  }

  async delete(id) {
    const url = this.buildUrl(`/${id}`);
    const response = await this.client.delete(url);
    return response.data;
  }
}

export default BaseApiService;

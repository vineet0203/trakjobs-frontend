// features/employees/services/employeeService.js
import BaseApiService from "../../../services/api/baseApiService";
import {
  transformEmployeeFromApi,
  transformEmployeeForApi,
} from "../utils/employeeTransformers";
import { API_ENDPOINTS } from "../../../services/api/config/apiConfig";

class EmployeeService extends BaseApiService {
  constructor() {
    super("employees");
    // Override base endpoints with vendor-specific paths
    this.endpoints = {
      ...this.endpoints,
      base: API_ENDPOINTS.employees.base,
      get: API_ENDPOINTS.employees.get,
      create: API_ENDPOINTS.employees.create,
      update: API_ENDPOINTS.employees.update,
      delete: API_ENDPOINTS.employees.delete,
    };

    // Add abort controllers
    this.managersController = null;
    this.employeesController = null;
  }

  unwrapPayload(response) {
    if (!response) return null;
    if (response.data !== undefined) return response.data;
    return response;
  }

  async getAll(params = {}) {
    // Cancel previous request if any
    if (this.employeesController) {
      this.employeesController.abort();
    }

    this.employeesController = new AbortController();

    try {
      const defaultParams = { vendor_id: this.getVendorId() };
      const response = await super.getAll({
        ...defaultParams,
        ...params,
        // signal removed from params
      });

      const raw = response.data || response;
      const arr = Array.isArray(raw) ? raw : (raw.data || []);
      return {
        data: arr.map(transformEmployeeFromApi),
        pagination: {
          total: response.meta?.total || arr.length,
          perPage: response.meta?.per_page || 5,
          currentPage: response.meta?.current_page || 1,
          totalPages: response.meta?.total_pages || 1,
          from: response.meta?.from || null,
          to: response.meta?.to || null,
        }
      };
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Previous request cancelled");
        return [];
      }
      throw error;
    }
  }

  async getById(id) {
    const response = await super.getById(id);
    const payload = this.unwrapPayload(response);
    return transformEmployeeFromApi(payload);
  }

  async create(data) {
    const apiData = transformEmployeeForApi(data);
    const response = await super.create(apiData);
    const payload = this.unwrapPayload(response);
    return transformEmployeeFromApi(payload);
  }

  async update(id, data) {
    const apiData = transformEmployeeForApi(data);
    const response = await super.update(id, apiData);
    const payload = this.unwrapPayload(response);
    return transformEmployeeFromApi(payload);
  }

  async delete(id) {
    const response = await super.delete(id);
    return this.unwrapPayload(response);
  }

  async getHierarchy() {
    const response = await this.client.get(API_ENDPOINTS.employees.hierarchy);
    return response.data;
  }

  async getStatistics() {
    const response = await this.client.get(
      API_ENDPOINTS.employees.statistics,
    );
    return response.data;
  }

  async getByDepartment(department) {
    const response = await this.client.get(
      API_ENDPOINTS.employees.byDepartment(department),
    );
    return response.data.map(transformEmployeeFromApi);
  }

  async getByDesignation(designation) {
    const response = await this.client.get(
      API_ENDPOINTS.employees.byDesignation(designation),
    );
    return response.data.map(transformEmployeeFromApi);
  }

  async getSubordinates(employeeId) {
    const response = await this.client.get(
      API_ENDPOINTS.employees.subordinates(employeeId),
    );
    return response.data.map(transformEmployeeFromApi);
  }

  // Updated with AbortController
  async getManagers(params = {}, signal = null) {
    // Cancel previous request if any
    if (this.managersController && !signal) {
      this.managersController.abort();
    }

    if (!signal) {
      this.managersController = new AbortController();
      signal = this.managersController.signal;
    }

    try {
      const response = await this.client.get(API_ENDPOINTS.employees.managers, {
        params,
        signal,
      });
      return response.data;
    } catch (error) {
      if (error.name === "AbortError" || error.code === "ERR_CANCELED") {
        return { data: [] };
      }
      throw error;
    }
  }
}

export default new EmployeeService();

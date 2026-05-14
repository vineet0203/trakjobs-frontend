import httpClient from '../../../services/api/httpClient';

/**
 * Reports API Service
 * Fetches real analytics data from the backend.
 */
class ReportsService {
  async getOverview(params = {}) {
    const response = await httpClient.get('/api/v1/vendors/reports/overview', { params });
    return response?.data?.data || response?.data || {};
  }

  async getServiceTypes() {
    const response = await httpClient.get('/api/v1/vendors/reports/service-types');
    return response?.data?.data || [];
  }
}

export default new ReportsService();

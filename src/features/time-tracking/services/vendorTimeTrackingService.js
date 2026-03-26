import httpClient from '../../../services/api/httpClient';

const vendorTimeTrackingService = {
  async getTimeEntries(page = 1, perPage = 10, filters = {}) {
    try {
      const params = { page, per_page: perPage, ...filters };
      const response = await httpClient.get('/api/v1/vendor/time-entries', { params });
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch time entries.');
    }
  },

  async approveTimeEntry(entryId) {
    try {
      const response = await httpClient.post(`/api/v1/vendor/time-entry/${entryId}/approve`);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.message || 'Failed to approve entry.');
    }
  },

  async rejectTimeEntry(entryId) {
    try {
      const response = await httpClient.post(`/api/v1/vendor/time-entry/${entryId}/reject`);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.message || 'Failed to reject entry.');
    }
  },
};

export default vendorTimeTrackingService;

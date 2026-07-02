import httpClient, { fileUploadClient } from '../../../services/api/httpClient';

export const verificationApi = {
  /**
   * Get verification progress state
   */
  async getProgress() {
    const response = await httpClient.get('/api/v1/verification/progress');
    return response.data;
  },

  /**
   * Save progress details for a wizard step
   */
  async saveProgress(step, data) {
    const response = await httpClient.post('/api/v1/verification/progress', {
      step,
      data,
    });
    return response.data;
  },

  /**
   * Upload government document (Passport, DL, ID card) to private disk
   */
  async uploadDocument(file, documentType) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);

    const response = await fileUploadClient.post('/api/v1/verification/document/upload', formData);
    return response.data;
  },

  async sendOtp(type, extraFields = {}) {
    const response = await httpClient.post('/api/v1/verification/otp/send', { type, ...extraFields });
    return response.data;
  },

  /**
   * Match the 6-digit OTP code input
   */
  async verifyOtp(code) {
    const response = await httpClient.post('/api/v1/verification/otp/verify', { code });
    return response.data;
  },
};

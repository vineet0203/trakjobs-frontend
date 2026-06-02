import httpClient from '../../../services/api/httpClient';

export const getConversations = async (search = '') => {
  const response = await httpClient.get('/messages/conversations', {
    params: { search }
  });
  return response.data;
};

export const getMessages = async (customerId) => {
  const response = await httpClient.get(`/messages/${customerId}`);
  return response.data;
};

export const sendMessage = async (customerId, body) => {
  const response = await httpClient.post('/messages/send', {
    customer_id: customerId,
    body
  });
  return response.data;
};

export const markAsRead = async (customerId) => {
  const response = await httpClient.post(`/messages/${customerId}/read`);
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await httpClient.get('/messages/unread-count');
  return response.data;
};

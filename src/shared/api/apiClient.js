import axios from 'axios';

const apiClient = axios.create({ baseURL: '/api', withCredentials: true, headers: { 'Content-Type': 'application/json' } });

apiClient.interceptors.request.use(config => {
  const token = sessionStorage.getItem('csrf_token');
  if (token && ['post','put','patch','delete'].includes(config.method?.toLowerCase()))
    config.headers['X-CSRF-Token'] = token;
  return config;
});

export default apiClient;
import axios from 'axios';

const apiClient = axios.create({ baseURL: '/api', withCredentials: true, headers: { 'Content-Type': 'application/json' } });

apiClient.interceptors.request.use(config => {
  const token = sessionStorage.getItem('csrf_token');
  if (token && ['post','put','patch','delete'].includes(config.method?.toLowerCase()))
    config.headers['X-CSRF-Token'] = token;
  return config;
});

apiClient.interceptors.response.use(
  r => r,
  async err => {
    const orig = err.config;
    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      try { await axios.post('/api/auth/refresh', {}, { withCredentials: true }); return apiClient(orig); }
      catch { window.location.href = '/login'; return Promise.reject(err); }
    }
    return Promise.reject(err);
  }
);

export default apiClient;
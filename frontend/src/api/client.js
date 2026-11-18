import axios from 'axios';

export const TOKEN_KEY = 'greenloop_token';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable (private mode) — session lasts until reload */
  }
}

const api = axios.create({ baseURL: '/api', timeout: 15000 });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Unwrap { success, data, message } so callers get `data`, and normalise errors to Error(message).
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.message ||
      (err.code === 'ECONNABORTED' ? 'The request timed out' : 'Could not reach GreenLoop. Is the server running?');
    const error = new Error(message);
    error.status = err.response?.status;
    error.fields = err.response?.data?.errors;
    return Promise.reject(error);
  }
);

export const unwrap = (promise) => promise.then((body) => body.data);
export default api;

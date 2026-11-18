import api, { unwrap } from './client';

// Drops empty values so URL-synced filters never send blank params.
const clean = (params) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null && !(Array.isArray(v) && !v.length)));

export const fetchItems = (params = {}) => unwrap(api.get('/items', { params: clean(params), paramsSerializer: { indexes: null } }));
export const fetchItem = (id) => unwrap(api.get(`/items/${id}`));
export const createItem = (body) => unwrap(api.post('/items', body));
export const updateItem = (id, body) => unwrap(api.patch(`/items/${id}`, body));
export const deleteItem = (id) => unwrap(api.delete(`/items/${id}`));
export const setItemStatus = (id, status) => unwrap(api.patch(`/items/${id}/status`, { status }));
export const previewScore = (body) => unwrap(api.post('/items/score-preview', body));

export const uploadImages = (files) => {
  const form = new FormData();
  files.forEach((f) => form.append('images', f));
  return unwrap(api.post('/items/upload', form, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 }));
};

export const fetchFavorites = () => unwrap(api.get('/favorites'));
export const toggleFavorite = (itemId) => unwrap(api.post(`/favorites/${itemId}`));

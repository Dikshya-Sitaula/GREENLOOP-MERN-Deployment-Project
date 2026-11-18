import api, { unwrap } from './client';

export const login = (body) => unwrap(api.post('/auth/login', body));
export const register = (body) => unwrap(api.post('/auth/register', body));
export const fetchMe = () => unwrap(api.get('/auth/me'));
export const updateMe = (body) => unwrap(api.patch('/auth/me', body));
export const logout = () => unwrap(api.post('/auth/logout'));

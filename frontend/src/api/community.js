import api, { unwrap } from './client';

export const fetchGlobalImpact = () => unwrap(api.get('/impact/global'));
export const fetchMyImpact = () => unwrap(api.get('/impact/me'));
export const fetchAssumptions = () => unwrap(api.get('/impact/assumptions'));
export const fetchTestimonials = () => unwrap(api.get('/testimonials'));
export const sendContact = (body) => unwrap(api.post('/contact', body));

export const fetchSwapMatches = (itemId) => unwrap(api.get(`/swaps/matches/${itemId}`));
export const fetchSwaps = () => unwrap(api.get('/swaps'));
export const proposeSwap = (body) => unwrap(api.post('/swaps', body));
export const respondToSwap = (id, status) => unwrap(api.patch(`/swaps/${id}`, { status }));

// Marketplace vocabularies. Categories live in MongoDB (see models/Category.js).
// Exposed to the client via /api/meta.

export const CITIES = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara'];
export const CONDITIONS = ['New', 'Like new', 'Good', 'Fair', 'Needs repair'];
export const TYPES = ['sell', 'swap', 'donate', 'repair'];
export const ACTIONS = TYPES;
export const STATUSES = ['active', 'reserved', 'paused', 'completed'];

// Demo photos are self-hosted in frontend/public/images (originally from Unsplash), served by Nginx/Vite.
export const unsplash = (id) => `/images/${id}.jpg`;

const npr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

export const formatNpr = (n) => `Rs. ${npr.format(Math.round(n || 0))}`;
export const formatNumber = (n, digits = 0) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: digits }).format(n || 0);

export function priceLabel(item) {
  if (item.type === 'sell') return formatNpr(item.price);
  if (item.type === 'swap') return 'Swap';
  if (item.type === 'donate') return 'Free';
  return 'Needs repair';
}

export function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return 'just now';
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  const [name, secs] = units.find(([, v]) => s >= v);
  const n = Math.floor(s / secs);
  return `${n} ${name}${n > 1 ? 's' : ''} ago`;
}

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

export const firstName = (name = '') => name.split(' ')[0];

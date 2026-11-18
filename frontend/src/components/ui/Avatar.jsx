import { initials } from '../../lib/format';

const TONES = ['bg-forest-100 text-forest-700', 'bg-marigold-100 text-[#8A5A12]', 'bg-swap-100 text-swap', 'bg-repair-100 text-repair'];

export default function Avatar({ user, size = 'h-10 w-10 text-sm' }) {
  const name = user?.name || '';
  const tone = TONES[(name.charCodeAt(0) + name.length) % TONES.length] || TONES[0];
  if (user?.avatar) {
    return <img src={user.avatar} alt={name} className={`${size} shrink-0 rounded-full object-cover`} />;
  }
  return (
    <span
      className={`${size} ${tone} inline-flex shrink-0 items-center justify-center rounded-full font-semibold`}
      aria-label={name}
    >
      {initials(name)}
    </span>
  );
}

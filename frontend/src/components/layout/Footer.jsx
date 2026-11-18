import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import { useMeta } from '../../api/meta';

const COLUMNS = [
  {
    title: 'Marketplace',
    links: [
      { to: '/explore', label: 'Explore items' },
      { to: '/sell', label: 'List an item' },
      { to: '/impact', label: 'Impact' },
    ],
  },
  {
    title: 'GreenLoop',
    links: [
      { to: '/about', label: 'About' },
      { to: '/contact', label: 'Contact' },
      { to: '/login', label: 'Log in' },
    ],
  },
];

export default function Footer() {
  const meta = useMeta();
  return (
    <footer className="bg-ink text-white/70">
      <div className="site-container py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="[&_span]:!text-white">
              <Logo light />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Reuse. Swap. Repair. Repeat. A circular marketplace for Nepal.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-white/50">{col.title}</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-white/50">Cities</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {(meta?.cities || []).map((c) => (
                <li key={c}>
                  <Link to={`/explore?city=${encodeURIComponent(c)}`} className="transition-colors hover:text-white">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} GreenLoop. Listings and members shown are demo data.</p>
          <p>Impact figures are estimates.</p>
        </div>
      </div>
    </footer>
  );
}

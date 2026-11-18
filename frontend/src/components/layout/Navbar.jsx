import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useScrolled } from '../../lib/hooks';
import { EASE } from '../../lib/motion';

const LINKS = [
  { to: '/explore', label: 'Explore' },
  { to: '/impact', label: 'Impact' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  // The home page opens on a dark hero, so the bar starts light-on-dark until it turns glass.
  const onDark = pathname === '/' && !scrolled && !open;
  const linkBase = 'rounded-full px-3.5 py-2 text-sm font-medium transition-colors';
  const linkTone = (active) =>
    onDark
      ? active ? 'bg-white/15 text-white' : 'text-white/75 hover:text-white'
      : active ? 'bg-forest-100 text-forest-900' : 'text-ink-muted hover:text-ink';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? 'border-b border-line/80 bg-paper/80 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <div className="site-container flex h-16 items-center justify-between md:h-[72px]">
        <Logo light={onDark} />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `${linkBase} ${linkTone(isActive)}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Button to="/sell" variant="accent" size="sm">
                List an item
              </Button>
              <Link to="/dashboard" className="rounded-full" aria-label="Open dashboard">
                <Avatar user={user} size="h-9 w-9 text-xs" />
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className={`${linkBase} ${linkTone(false)}`}>
                Log in
              </Link>
              <Button to="/register" variant={onDark ? 'outline-light' : 'primary'} size="sm">
                Join GreenLoop
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className={`-mr-2 rounded-full p-2 md:hidden ${onDark ? 'text-white' : 'text-ink'}`}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-6 w-6" strokeWidth={1.5} /> : <Menu className="h-6 w-6" strokeWidth={1.5} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            className="overflow-hidden border-t border-line bg-paper md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: { duration: 0.35, ease: EASE } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
          >
            <div className="site-container flex flex-col gap-1 py-4">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-3 text-base font-medium ${isActive ? 'bg-forest-100 text-forest-900' : 'text-ink'}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-line pt-4">
                {user ? (
                  <>
                    <Button to="/sell" variant="accent">
                      List an item
                    </Button>
                    <Button to="/dashboard" variant="outline">
                      <LayoutDashboard className="h-4 w-4" strokeWidth={1.5} /> Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                    >
                      <LogOut className="h-4 w-4" strokeWidth={1.5} /> Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button to="/register">Join GreenLoop</Button>
                    <Button to="/login" variant="outline">
                      Log in
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

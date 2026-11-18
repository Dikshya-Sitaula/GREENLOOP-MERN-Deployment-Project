import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePageTitle } from '../lib/hooks';
import { firstName } from '../lib/format';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import MyListings from '../components/dashboard/MyListings';
import SavedItems from '../components/dashboard/SavedItems';
import SwapRequests from '../components/dashboard/SwapRequests';

const TABS = [
  ['listings', 'My listings'],
  ['saved', 'Saved'],
  ['swaps', 'Swap requests'],
];

export default function Dashboard() {
  usePageTitle('Dashboard');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('listings');

  return (
    <section className="bg-paper pb-24 pt-28 md:pt-36">
      <div className="site-container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar user={user} size="h-14 w-14 text-lg" />
            <div>
              <h1 className="text-3xl tracking-tightest md:text-4xl">Hi, {firstName(user.name)}</h1>
              <p className="text-sm text-ink-muted">{user.city} · <Link to="/impact" className="font-medium text-forest-700 hover:underline">See your impact</Link></p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button to="/sell" variant="accent"><Plus className="h-4 w-4" strokeWidth={1.5} /> List an item</Button>
            <Button variant="outline" onClick={() => { logout(); navigate('/'); }}><LogOut className="h-4 w-4" strokeWidth={1.5} /> Log out</Button>
          </div>
        </div>

        <div role="tablist" aria-label="Dashboard sections" className="no-scrollbar mt-10 flex gap-1 overflow-x-auto border-b border-line">
          {TABS.map(([key, label]) => (
            <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${tab === key ? 'border-forest-700 text-ink' : 'border-transparent text-ink-muted hover:text-ink'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8" role="tabpanel">
          {tab === 'listings' && <MyListings userId={user._id} />}
          {tab === 'saved' && <SavedItems />}
          {tab === 'swaps' && <SwapRequests />}
        </div>
      </div>
    </section>
  );
}

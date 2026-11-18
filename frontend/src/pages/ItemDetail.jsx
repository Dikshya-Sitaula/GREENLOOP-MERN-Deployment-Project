import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle2, ChevronLeft, Clock, Leaf, Mail, MapPin, Repeat2 } from 'lucide-react';
import { fetchItem } from '../api/items';
import { fetchAssumptions, fetchSwapMatches } from '../api/community';
import { useAuth } from '../context/AuthContext';
import { useAsync, usePageTitle } from '../lib/hooks';
import { formatNumber, priceLabel, timeAgo } from '../lib/format';
import ImageGallery from '../components/items/ImageGallery';
import ScoreBreakdown from '../components/items/ScoreBreakdown';
import SwapModal from '../components/items/SwapModal';
import SaveButton from '../components/items/SaveButton';
import ListingActions from '../components/items/ListingActions';
import StatusBadge from '../components/ui/StatusBadge';
import ItemGrid from '../components/items/ItemGrid';
import TypePill from '../components/ui/TypePill';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { ErrorState, Skeleton } from '../components/ui/States';

function DetailSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
      <Skeleton className="aspect-[4/3]" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-40" />
      </div>
    </div>
  );
}

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsync(() => fetchItem(id), [id, user?._id]);
  const assumptions = useAsync(fetchAssumptions, []);
  const swapItem = data?.item;
  const wantsMatches = Boolean(user && swapItem?.type === 'swap' && swapItem.owner?._id === user._id && swapItem.status === 'active' && swapItem.wantedCategory);
  const matches = useAsync(() => (wantsMatches ? fetchSwapMatches(swapItem._id) : Promise.resolve(null)), [wantsMatches, swapItem?._id]);
  const [swapOpen, setSwapOpen] = useState(false);
  const item = data?.item;
  usePageTitle(item?.title || 'Item');

  const isOwner = user && item && item.owner?._id === user._id;
  const co2 = item && assumptions.data ? item.estimatedKg * assumptions.data.co2PerKg : null;

  const contactHref = item?.owner?.email
    ? `mailto:${item.owner.email}?subject=${encodeURIComponent(`GreenLoop: ${item.title}`)}&body=${encodeURIComponent(`Hi ${item.owner.name.split(' ')[0]}, I'm interested in "${item.title}" on GreenLoop.`)}`
    : null;

  return (
    <section className="bg-paper pb-24 pt-28 md:pt-32">
      <div className="site-container">
        <button type="button" onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-ink-muted hover:text-ink">
          <ChevronLeft className="h-4 w-4" strokeWidth={1.5} /> Back
        </button>

        {loading && !item ? (
          <DetailSkeleton />
        ) : error ? (
          <ErrorState message={error.status === 404 ? 'This item may have been removed.' : error.message} onRetry={error.status === 404 ? undefined : reload} />
        ) : (
          <>
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
              <div className="relative">
                <ImageGallery images={item.images} title={item.title} />
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <TypePill type={item.type} />
                  {item.status !== 'active' && <StatusBadge status={item.status} />}
                  <span className="text-xs text-ink-muted">{item.category} · Listed {timeAgo(item.createdAt)}</span>
                </div>
                <h1 className="mt-4 text-4xl leading-tight tracking-tightest md:text-5xl">{item.title}</h1>
                <p className="num mt-4 font-display text-4xl text-forest-900">{priceLabel(item)}</p>
                {item.type === 'swap' && (item.wantedCategory || item.wantedNote) && (
                  <p className="mt-2 text-sm text-ink-muted">
                    Looking for:{' '}
                    {item.wantedCategory && <Link to={`/explore?category=${encodeURIComponent(item.wantedCategory)}&type=swap`} className="font-medium text-ink underline decoration-line underline-offset-2 hover:decoration-ink">{item.wantedCategory}</Link>}
                    {item.wantedNote && <span className="font-medium text-ink">{item.wantedCategory ? ' — ' : ''}{item.wantedNote}</span>}
                  </p>
                )}
                {item.type === 'repair' && item.wantInReturn && <p className="mt-2 text-sm text-ink-muted">Needs fixing: <span className="font-medium text-ink">{item.wantInReturn}</span></p>}

                <dl className="mt-6 grid grid-cols-2 gap-4 rounded-card border border-line bg-surface p-4 text-sm">
                  <div><dt className="text-ink-muted">Condition</dt><dd className="mt-0.5 font-medium">{item.condition}</dd></div>
                  <div><dt className="text-ink-muted">Location</dt><dd className="mt-0.5 inline-flex items-center gap-1 font-medium"><MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />{item.city}</dd></div>
                </dl>

                <p className="mt-6 whitespace-pre-line leading-relaxed text-ink-muted">{item.description}</p>

                {isOwner && (
                  <div className="mt-6 space-y-3 rounded-card border border-line bg-surface p-4">
                    <p className="text-sm font-semibold">Manage your listing</p>
                    {item.status === 'paused' && <p className="text-sm text-ink-muted">Paused — only you can see this listing. Resume it to show it in Explore again.</p>}
                    {item.status === 'reserved' && <p className="text-sm text-ink-muted">Reserved — still visible, but marked as taken for now.</p>}
                    {item.status === 'completed' && <p className="text-sm text-ink-muted">Completed — counted in your impact. Reopen it to make it available again (the impact is removed).</p>}
                    <ListingActions item={item} onChanged={reload} onDeleted={() => navigate('/dashboard')} />
                    {item.status !== 'completed' && <Button to="/dashboard" variant="ghost" size="sm">Edit in dashboard</Button>}
                  </div>
                )}

                {!isOwner && item.status === 'completed' && (
                  <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest-100 px-4 py-2 text-sm font-medium text-forest-900">
                    <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} /> This item found a new home
                  </p>
                )}
                {!isOwner && item.status === 'reserved' && (
                  <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-marigold-100 px-4 py-2 text-sm font-medium text-[#8A5A12]">
                    <Clock className="h-4 w-4" strokeWidth={1.5} /> Reserved for someone — check back soon
                  </p>
                )}

                {!isOwner && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {item.status === 'active' && (
                      <>
                        {item.type === 'swap' && (
                          <Button variant="accent" size="lg" onClick={() => (user ? setSwapOpen(true) : navigate('/login', { state: { from: `/items/${item._id}` } }))}>
                            <Repeat2 className="h-4 w-4" strokeWidth={1.5} /> Propose swap
                          </Button>
                        )}
                        {user ? (
                          <Button href={contactHref} variant={item.type === 'swap' ? 'outline' : 'accent'} size="lg">
                            <Mail className="h-4 w-4" strokeWidth={1.5} /> {item.type === 'sell' ? 'Contact seller' : 'Request item'}
                          </Button>
                        ) : (
                          <Button to="/login" state={{ from: `/items/${item._id}` }} variant={item.type === 'swap' ? 'outline' : 'accent'} size="lg">Log in to contact</Button>
                        )}
                      </>
                    )}
                    <SaveButton item={item} label className="border border-line !bg-surface" />
                  </div>
                )}

                <div className="mt-8 flex items-center gap-3 rounded-card border border-line bg-surface p-4">
                  <Avatar user={item.owner} size="h-12 w-12 text-sm" />
                  <div>
                    <p className="text-xs text-ink-muted">Listed by</p>
                    <p className="font-semibold">{item.owner?.name}</p>
                    <p className="text-xs text-ink-muted">{item.owner?.city} · Member since {new Date(item.owner?.createdAt).getFullYear()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              <ScoreBreakdown score={item.circularityScore} band={item.scoreBand} breakdown={item.scoreBreakdown} max={assumptions.data?.scoreMax} />
              <div className="rounded-card border border-line bg-forest-100/60 p-5">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-forest-900"><Leaf className="h-4 w-4" strokeWidth={1.5} /> Estimated impact</p>
                <p className="num mt-4 font-display text-5xl text-forest-900">{formatNumber(item.estimatedKg, 1)} kg</p>
                <p className="mt-1 text-sm text-forest-700">kept in use instead of becoming waste</p>
                {co2 != null && <p className="num mt-4 text-sm text-forest-900">≈ {formatNumber(co2, 1)} kg CO₂e avoided</p>}
                <p className="mt-4 text-xs text-forest-700/80">Estimates based on average category weight. <Link to="/impact" className="underline">How we calculate</Link></p>
              </div>
            </div>

            {matches.data?.items?.length > 0 && (
              <div className="mt-14">
                <h2 className="text-3xl tracking-tightest">Possible swaps</h2>
                <p className="mt-2 text-sm text-ink-muted">Swap listings in {item.wantedCategory}, the category you asked for.</p>
                <div className="mt-6"><ItemGrid items={matches.data.items} /></div>
              </div>
            )}

            {data.similar.length > 0 && (
              <div className="mt-16">
                <h2 className="text-3xl tracking-tightest">More in {item.category}</h2>
                <div className="mt-6"><ItemGrid items={data.similar} /></div>
              </div>
            )}
          </>
        )}
      </div>
      {item && <SwapModal open={swapOpen} onClose={() => setSwapOpen(false)} target={item} />}
    </section>
  );
}

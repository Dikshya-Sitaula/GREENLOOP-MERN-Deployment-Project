import Hero from '../components/home/Hero';
import TrustStrip from '../components/home/TrustStrip';
import Lifecycle from '../components/home/Lifecycle';
import HowItWorks from '../components/home/HowItWorks';
import FreshListings from '../components/home/FreshListings';
import CategoryBento from '../components/home/CategoryBento';
import ImpactBand from '../components/home/ImpactBand';
import Testimonials from '../components/home/Testimonials';
import FinalCta from '../components/home/FinalCta';
import { fetchItems } from '../api/items';
import { fetchGlobalImpact, fetchTestimonials } from '../api/community';
import { useMeta } from '../api/meta';
import { useAsync, usePageTitle } from '../lib/hooks';

export default function Home() {
  usePageTitle('');
  const meta = useMeta();
  const fresh = useAsync(() => fetchItems({ limit: 10, sort: 'newest' }), []);
  const impact = useAsync(fetchGlobalImpact, []);
  const stories = useAsync(fetchTestimonials, []);
  const items = fresh.data?.items;

  return (
    <>
      <Hero items={items} />
      <TrustStrip impact={impact.data} cityCount={meta?.cities.length} loading={impact.loading} />
      <Lifecycle item={items?.[3]} impact={impact.data} />
      <HowItWorks />
      <FreshListings items={items} loading={fresh.loading} error={fresh.error} onRetry={fresh.reload} />
      <CategoryBento categories={meta?.categories} />
      <ImpactBand impact={impact.data} loading={impact.loading} error={impact.error} onRetry={impact.reload} />
      <Testimonials items={stories.data} loading={stories.loading} error={stories.error} onRetry={stories.reload} />
      <FinalCta />
    </>
  );
}

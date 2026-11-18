import { Compass } from 'lucide-react';
import Button from '../components/ui/Button';
import { EmptyState } from '../components/ui/States';
import { usePageTitle } from '../lib/hooks';

export default function NotFound() {
  usePageTitle('Page not found');
  return (
    <section className="site-container pb-24 pt-32 md:pt-40">
      <EmptyState
        icon={Compass}
        title="This page took a different loop"
        message="We couldn't find what you were looking for. Let's get you back to something good."
        action={<Button to="/explore">Explore items</Button>}
      />
    </section>
  );
}

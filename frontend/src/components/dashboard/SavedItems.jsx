import { Heart } from 'lucide-react';
import { fetchFavorites } from '../../api/items';
import { useAsync } from '../../lib/hooks';
import ItemGrid from '../items/ItemGrid';
import Button from '../ui/Button';

export default function SavedItems() {
  const { data, loading, error, reload, setData } = useAsync(fetchFavorites, []);
  return (
    <ItemGrid
      items={data}
      loading={loading}
      error={error}
      onRetry={reload}
      skeletons={4}
      onSavedChange={(id, saved) => !saved && setData((data || []).filter((i) => i._id !== id))}
      className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3"
      empty={{ icon: Heart, title: 'Nothing saved yet', message: 'Tap the heart on anything you like and it will wait here.', action: <Button to="/explore">Explore items</Button> }}
    />
  );
}

import { useEffect, useState } from 'react';
import api, { unwrap } from './client';

export const fetchMeta = () => unwrap(api.get('/meta'));

let cache = null;

// Shared marketplace vocabulary (cities, categories, conditions) loaded once from the API.
export function useMeta() {
  const [meta, setMeta] = useState(cache);
  useEffect(() => {
    if (cache) return;
    fetchMeta()
      .then((m) => {
        cache = m;
        setMeta(m);
      })
      .catch(() => {});
  }, []);
  return meta;
}

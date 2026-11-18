import { useCallback, useEffect, useRef, useState } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · GreenLoop` : 'GreenLoop — Give Things Another Life';
  }, [title]);
}

// Runs an async loader and tracks the four list states: loading, error, empty (caller decides), success.
export function useAsync(loader, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const seq = useRef(0);

  const run = useCallback(() => {
    const id = ++seq.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    return loader()
      .then((data) => {
        if (id === seq.current) setState({ data, error: null, loading: false });
        return data;
      })
      .catch((error) => {
        if (id === seq.current) setState((s) => ({ ...s, error, loading: false }));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, reload: run, setData: (data) => setState((s) => ({ ...s, data })) };
}

export function useScrolled(offset = 12) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [offset]);
  return scrolled;
}

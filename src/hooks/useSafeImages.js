import { useCallback, useState } from 'react';

export default function useSafeImages() {
  const [failed, setFailed] = useState(() => new Set());

  const markFailed = useCallback((url) => {
    if (!url) return;
    setFailed((prev) => {
      if (prev.has(url)) return prev;
      const next = new Set(prev);
      next.add(url);
      return next;
    });
  }, []);

  const reset = useCallback(() => setFailed(new Set()), []);

  const filter = useCallback(
    (images) => (images || []).filter((img) => img?.url && !failed.has(img.url)),
    [failed]
  );

  return { markFailed, filter, reset };
}
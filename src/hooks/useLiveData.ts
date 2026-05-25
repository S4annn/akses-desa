import { useCallback, useEffect, useState } from 'react';
import { type EventType, subscribeRefresh } from '../services/notificationBus';

/**
 * Hook untuk fetch data + auto-refresh saat ada event tertentu di bus.
 * Memastikan halaman publik & admin selalu sync.
 *
 * @example
 * const { data, loading, refresh } = useLiveData(
 *   () => listPublicPosts(),
 *   ['post_created', 'post_updated', 'post_deleted']
 * );
 */
export function useLiveData<T>(
  fetcher: () => Promise<T>,
  events: EventType[],
  initial?: T
) {
  const [data, setData] = useState<T | undefined>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      const result = await fetcher();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refresh();
    const unsub = subscribeRefresh(events, refresh);
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, refresh, setData };
}

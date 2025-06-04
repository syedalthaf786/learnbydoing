import { useState, useEffect, useCallback } from 'react';

function useInfiniteScroll(fetchMore, options = {}) {
  const {
    threshold = 100,
    initialPage = 1,
    enabled = true
  } = options;

  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const handleScroll = useCallback(() => {
    if (!enabled || loading || !hasMore) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollHeight - scrollTop - clientHeight < threshold) {
      setPage(prev => prev + 1);
    }
  }, [enabled, loading, hasMore, threshold]);

  useEffect(() => {
    const loadMore = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchMore(page);
        setHasMore(result.hasMore);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (enabled) {
      loadMore();
    }
  }, [page, fetchMore, enabled]);

  useEffect(() => {
    if (enabled) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, enabled]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setHasMore(true);
    setError(null);
  }, [initialPage]);

  return {
    page,
    loading,
    hasMore,
    error,
    reset
  };
}

export default useInfiniteScroll;
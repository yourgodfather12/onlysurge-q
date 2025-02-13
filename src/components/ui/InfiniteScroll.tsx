import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { LoadingSpinner } from './LoadingSpinner';

interface InfiniteScrollProps {
  children: React.ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  loading?: boolean;
}

export function InfiniteScroll({
  children,
  onLoadMore,
  hasMore,
  loading = false
}: InfiniteScrollProps) {
  const { ref, inView } = useInView({
    threshold: 0.5
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      onLoadMore();
    }
  }, [inView, hasMore, loading, onLoadMore]);

  return (
    <div>
      {children}
      <div ref={ref} className="h-20 flex items-center justify-center">
        {loading && <LoadingSpinner />}
      </div>
    </div>
  );
}
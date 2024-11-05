// components/DataFetcher.jsx
import { useLoading } from '../hooks/useLoading';
import { TextSkeleton } from './Skeleton';

const DataFetcher = () => {
  const [fetchData, loading] = useLoading(async () => {
    const response = await fetch('/api/data');
    const data = await response.json();
    // Process data
  });

  return (
    <div>
      {loading ? (
        <div className="space-y-2">
          <TextSkeleton />
          <TextSkeleton />
          <TextSkeleton />
        </div>
      ) : (
        <div>
          {/* Add your content here */}
        </div>
      )}
    </div>
  );
};

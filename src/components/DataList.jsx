// components/DataList.jsx
import { useState, useEffect } from 'react';
import { CardSkeleton } from './Skeleton';

const DataList = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {data?.map((item) => (
        <div
          key={item.id}
          className="p-4 border rounded-lg transition-all hover:shadow-lg"
        >
          {/* Your content */}
        </div>
      ))}
    </div>
  );
};

// components/Skeleton.jsx
const Skeleton = ({ width, height, className }) => {
    return (
      <div
        className={`animate-pulse bg-gray-200 rounded ${className}`}
        style={{ width, height }}
      />
    );
  };
  
  // Preset skeletons
  export const CardSkeleton = () => (
    <div className="p-4 border rounded-lg">
      <Skeleton width="100%" height="200px" />
      <Skeleton width="70%" height="20px" className="mt-4" />
      <Skeleton width="40%" height="16px" className="mt-2" />
    </div>
  );
  
  export const TextSkeleton = () => (
    <Skeleton width="100%" height="16px" className="my-2" />
  );
  
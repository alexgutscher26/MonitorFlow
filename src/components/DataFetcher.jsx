import { useLoading } from '../hooks/useLoading';
import { TextSkeleton } from './Skeleton';

/**
 * Component for fetching data and displaying either loading skeletons or the loaded content.
 * Utilizes a custom `useLoading` hook for loading state management.
 */
const DataFetcher = () => {
  /**
   * Initiates a data-fetching function with loading state tracking.
   * 
   * @returns {Array} - Returns an array containing:
   * 1. `fetchData` - The function to initiate the data fetch.
   * 2. `loading` - A boolean indicating whether data is being loaded.
   */
  const [fetchData, loading] = useLoading(async () => {
    const response = await fetch('/api/data');  // Fetches data from the specified API endpoint
    const data = await response.json();         // Parses JSON response

    // `data` is fetched but not used yet; include processing or state update here as needed.
    // Example: setData(data) or pass data to another function
  });

  return (
    <div>
      {loading ? (
        // Displays loading skeletons while data is being fetched
        <div className="space-y-2">
          <TextSkeleton />
          <TextSkeleton />
          <TextSkeleton />
        </div>
      ) : (
        // Displays the main content once loading is complete
        <div>
          {/* Add your content here, and process or render `data` as needed */}
        </div>
      )}
    </div>
  );
};

// Exporting the component for use in other parts of the application
export default DataFetcher;

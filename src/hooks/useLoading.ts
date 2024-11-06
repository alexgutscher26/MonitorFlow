import { useState } from 'react';

type CallbackFunction = (...args: any[]) => Promise<any>;

export const useLoading = (callback: CallbackFunction) => {
  const [loading, setLoading] = useState<boolean>(false);

  const execute = async (...args: any[]): Promise<void> => {
    setLoading(true);
    try {
      const result = await callback(...args); // Directly await the Promise from callback
      
      // Process result if needed
    } catch (error) {
      console.error("Callback execution failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, execute };
};

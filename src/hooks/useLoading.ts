import { useState } from 'react';

type CallbackFunction = (...args: any[]) => Promise<any>;
export const useLoading = (callback: CallbackFunction) => {
  const [loading, setLoading] = useState<boolean>(false);

  const execute = async (...args: any[]): Promise<void> => {
    setLoading(true);
    try {
      await callback(...args);
    } finally {
      setLoading(false);
    }
  };

  return [execute, loading] as const;
};

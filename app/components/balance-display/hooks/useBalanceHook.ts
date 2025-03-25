import { useState, useEffect, useCallback } from 'react';
import { fetchBalance } from '../../../api/api';

interface UseBalanceHookResult {
  balance: number;
  currency: string;
  isLoading: boolean;
  error: Error | null;
  refreshBalance: () => Promise<void>;
}

export const useBalanceHook = (customerId: string): UseBalanceHookResult => {
  const [balance, setBalance] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('EUR');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserBalance = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchBalance(customerId);
      
      if (response.status.code === 'VALID' && !response.status.error) {
        setBalance(response.balance);
        setCurrency(response.currency);
        setError(null);
      } else {
        throw new Error(response.status.error_message || 'Failed to fetch balance');
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

 
  useEffect(() => {
    fetchUserBalance();
  }, [fetchUserBalance]);

  return {
    balance,
    currency,
    isLoading,
    error,
    refreshBalance: fetchUserBalance
  };
};
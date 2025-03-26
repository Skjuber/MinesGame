import { useState, useEffect } from 'react';
import { fetchBalance,} from '../../api/api';

interface UseBalanceProps {
  customerId: string;
}

interface UseBalanceResult {
  balance: number;
  currency: string;
  isLoading: boolean;
  error: Error | null;
  refreshBalance: () => Promise<void>;
}

const useBalance = ({ customerId }: UseBalanceProps): UseBalanceResult => {
  const [balance, setBalance] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('EUR');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserBalance = async () => {
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
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchUserBalance();
  }, [customerId]);

  return {
    balance,
    currency,
    isLoading,
    error,
    refreshBalance: fetchUserBalance
  };
};

export default useBalance;
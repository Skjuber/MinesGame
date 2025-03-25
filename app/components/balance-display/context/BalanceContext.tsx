"use client";

import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { fetchBalance } from '../../../api/api';

interface BalanceContextType {
  balance: number;
  currency: string;
  isLoading: boolean;
  error: Error | null;
  refreshBalance: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

interface BalanceProviderProps {
  children: ReactNode;
  customerId: string;
}

export const BalanceProvider: React.FC<BalanceProviderProps> = ({ children, customerId }) => {
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

  // Initial fetch
  useEffect(() => {
    fetchUserBalance();
  }, [fetchUserBalance]);

  const value = {
    balance,
    currency,
    isLoading,
    error,
    refreshBalance: fetchUserBalance
  };

  return <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>;
};

export const useBalance = (): BalanceContextType => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};
"use client"

import React from 'react';
import { useBalance } from './context/BalanceContext';

const BalanceDisplay: React.FC = () => {
  const { balance, currency, isLoading, error } = useBalance();

 
  const formattedBalance = (balance / 100).toFixed(2);
  
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div>BALANCE</div>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div>BALANCE</div>
        <div>Error</div>
      </div>
    );
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <div>BALANCE</div>
      <div>{`${currency}${formattedBalance}`}</div>
    </div>
  );
};

export default BalanceDisplay;
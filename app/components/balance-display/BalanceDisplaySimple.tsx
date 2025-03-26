import React from 'react';
import { useBalanceHook } from './hooks/useBalanceHook';

const BalanceDisplaySimple: React.FC = () => {
 
  const customerId = '92dcf3b1-d73e-4acc-a15e-51f21c156da9'; 
  const { balance, currency, isLoading, error } = useBalanceHook(customerId);

  
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

export default BalanceDisplaySimple;
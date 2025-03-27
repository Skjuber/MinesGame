"use client"

import React from 'react';
import { BalanceProvider } from './components/balance-display/context/BalanceContext';
import MinesGame from './MinesGame';

const App: React.FC = () => {
  const customerId = '92dcf3b1-d73e-4acc-a15e-51f21c156da9';
  
  return (
    <BalanceProvider customerId={customerId}>
      <MinesGame customerId={customerId} />
    </BalanceProvider>
  );
};

export default App;
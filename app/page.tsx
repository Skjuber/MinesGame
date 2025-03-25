import React from 'react';
import { BalanceProvider } from './components/balance-display/context/BalanceContext';
import BalanceDisplay from './components/balance-display/BalanceDisplay';

const MinesGame: React.FC = () => {
  // Replace with your actual customer ID from the email
  const customerId = '92dcf3b1-d73e-4acc-a15e-51f21c156da9';
  
  return (
    <div>
      <BalanceProvider customerId={customerId}>
        <div>
          <button>←</button>
          <BalanceDisplay />
        </div>
        
        <div>
          {/* Game board - 5x5 grid */}
          <div>
            {/* Tiles rendered here */}
          </div>
          
          <div>
            <div>
              <label htmlFor="betAmount">Bet Amount</label>
              <input 
                type="number" 
                id="betAmount" 
                defaultValue="10.00" 
                min="1" 
                step="0.01" 
              />
            </div>
            
            <button>
              Place Bet
            </button>
          </div>
        </div>
      </BalanceProvider>
    </div>
  );
};

export default MinesGame;
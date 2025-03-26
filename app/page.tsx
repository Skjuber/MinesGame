"use client"

import React, { useState, useEffect } from 'react';
import { BalanceProvider } from './components/balance-display/context/BalanceContext';
import BalanceDisplay from './components/balance-display/BalanceDisplay';
import Board from './components/tile/board';
import { TileContent } from './components/tile/tile';
import { placeBet, processCashout } from './api/api';
const MinesGame: React.FC = () => {
 
  const customerId = '92dcf3b1-d73e-4acc-a15e-51f21c156da9';
  
  
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [resetBoard, setResetBoard] = useState<boolean>(false);
  const [betAmount, setBetAmount] = useState<number>(1000); 
  const [openedTiles, setOpenedTiles] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [canCashout, setCanCashout] = useState<boolean>(false);
  

  useEffect(() => {
    if (openedTiles > 0) {
  
      const newMultiplier = 1 + (0.2 * openedTiles);
      setMultiplier(newMultiplier);
      setCanCashout(true);
    } else {
      setMultiplier(1);
      setCanCashout(false);
    }
  }, [openedTiles]);
  

  const handleTileReveal = (content: TileContent) => {
    if (content === 'gem') {
    
      setOpenedTiles(prev => prev + 1);
    } else if (content === 'bomb') {

      setGameActive(false);
      setCanCashout(false);
      alert('Game Over! You hit a bomb.');
    }
  };
  
 
  const handlePlaceBet = async () => {
    try {
  
      const response = await placeBet(customerId, betAmount);
      
      if (response.status.code === 'VALID' && !response.status.error) {
        
        setOpenedTiles(0);
        setGameActive(true);
        setResetBoard(!resetBoard);
      } else {
        alert(`Error placing bet: ${response.status.error_message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error placing bet:', error);
      alert('Failed to place bet. Please try again.');
    }
  };
  
 
  const handleCashout = async () => {
    if (!canCashout) return;
    
    try {
   
      const winnings = Math.floor(betAmount * multiplier);
      

      const response = await processCashout(customerId, winnings);
      
      if (response.status.code === 'VALID' && !response.status.error) {
        alert(`Successfully cashed out ${(winnings / 100).toFixed(2)} EUR!`);
        setGameActive(false);
        setCanCashout(false);
      } else {
        alert(`Error cashing out: ${response.status.error_message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error cashing out:', error);
      alert('Failed to cash out. Please try again.');
    }
  };

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  
    const valueInCents = Math.floor(parseFloat(e.target.value) * 100);
    if (!isNaN(valueInCents) && valueInCents > 0) {
      setBetAmount(valueInCents);
    }
  };
  
  return (
    <div>
      <BalanceProvider customerId={customerId}>
        <div>
          <button>←</button>
          <BalanceDisplay />
        </div>
        
        {gameActive && (
          <div>
            <p>Multiplier: {multiplier.toFixed(2)}x</p>
            <p>Potential win: {((betAmount * multiplier) / 100).toFixed(2)} EUR</p>
            {canCashout && (
              <button onClick={handleCashout}>
                Cash Out
              </button>
            )}
          </div>
        )}
        
        <div>
          <Board
            onTileReveal={handleTileReveal}
            gameActive={gameActive}
            resetGame={resetBoard}
            bombCount={3}
          />
        </div>
        
        {!gameActive && (
          <div>
            <div>
              <label htmlFor="betAmount">Bet Amount</label>
              <input 
                type="number" 
                id="betAmount" 
                value={(betAmount / 100).toFixed(2)}
                onChange={handleBetChange}
                min="1" 
                step="0.01" 
              />
            </div>
            
            <button onClick={handlePlaceBet}>
              Place Bet Ante
            </button>
          </div>
        )}
      </BalanceProvider>
    </div>
  );
};

export default MinesGame;
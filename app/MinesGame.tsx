"use client"

import React, { useState, useEffect } from 'react';
import { useBalance } from './components/balance-display/context/BalanceContext';
import BalanceDisplay from './components/balance-display/BalanceDisplay';
import Board from './components/tile/board';
import { TileContent } from './components/tile/tile';
import { placeBet, processCashout } from './api/api';

interface MinesGameProps {
  customerId: string;
}

const MinesGame: React.FC<MinesGameProps> = ({ customerId }) => {
  const { refreshBalance } = useBalance();
  

  const [gameActive, setGameActive] = useState(false);
  const [resetBoard, setResetBoard] = useState(false);
  const [betAmount, setBetAmount] = useState(1000); 
  const [openedTiles, setOpenedTiles] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [canCashout, setCanCashout] = useState(false);

 
  useEffect(() => {
    if (openedTiles > 0) {
      setMultiplier(1 + (0.2 * openedTiles));
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
      endGame();
      alert('Game Over! You hit a bomb.');
    }
  };

  const handlePlaceBet = async () => {
    try {
      const response = await placeBet(customerId, betAmount);
      
      if (response.status.code === 'VALID') {
        startNewGame();
      } else {
        alert(`Error: ${response.status.error_message || 'Failed to place bet'}`);
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
      
      if (response.status.code === 'VALID') {
        alert(`Successfully cashed out ${(winnings / 100).toFixed(2)} EUR!`);
        endGame();
        await refreshBalance();
      } else {
        alert(`Error: ${response.status.error_message || 'Failed to cash out'}`);
      }
    } catch (error) {
      console.error('Error cashing out:', error);
      alert('Failed to cash out. Please try again.');
    }
  };

  const startNewGame = () => {
    setOpenedTiles(0);
    setGameActive(true);
    setResetBoard(prev => !prev);
  };

  const endGame = () => {
    setGameActive(false);
    setCanCashout(false);
  };

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueInCents = Math.floor(parseFloat(e.target.value) * 100);
    if (!isNaN(valueInCents) && valueInCents > 0) {
      setBetAmount(valueInCents);
    }
  };

  return (
    <div className="mines-game">
      <div className="game-header">
        <button className="back-button">←</button>
        <BalanceDisplay />
      </div>
      
      {gameActive && (
        <div className="game-stats">
          <p>Multiplier: {multiplier.toFixed(2)}x</p>
          <p>Potential win: {((betAmount * multiplier) / 100).toFixed(2)} EUR</p>
          {canCashout && (
            <button className="cashout-button" onClick={handleCashout}>
              Cash Out
            </button>
          )}
        </div>
      )}
      
      <Board
        onTileReveal={handleTileReveal}
        gameActive={gameActive}
        resetGame={resetBoard}
        bombCount={3}
      />
      
      {!gameActive && (
        <div className="bet-controls">
          <div className="bet-amount">
            <label htmlFor="betAmount">Bet Amount (EUR)</label>
            <input
              type="number"
              id="betAmount"
              value={(betAmount / 100).toFixed(2)}
              onChange={handleBetChange}
              min="1"
              step="0.01"
            />
          </div>
          <button className="bet-button" onClick={handlePlaceBet}>
            Place Bet
          </button>
        </div>
      )}
    </div>
  );
};

export default MinesGame;
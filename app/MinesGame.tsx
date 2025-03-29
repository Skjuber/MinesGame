"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useBalance } from './components/balance-display/context/BalanceContext';
import BalanceDisplay from './components/balance-display/BalanceDisplay';
import Board, { BoardRef } from './components/tile/board';
import { TileContent } from './components/tile/tile';
import { placeBet, processCashout } from './api/api';
import styles from './minesGame.module.css';

interface MinesGameProps {
  customerId: string;
}

const MinesGame: React.FC<MinesGameProps> = ({ customerId }) => {
  const { refreshBalance } = useBalance();
  const boardRef = useRef<BoardRef>(null);
  
  const [gameActive, setGameActive] = useState(false);
  const [resetBoard, setResetBoard] = useState(false);
  const [betAmount, setBetAmount] = useState(1000); 
  const [openedTiles, setOpenedTiles] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [canCashout, setCanCashout] = useState(false);
  const [showWinMessage, setShowWinMessage] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [winMultiplier, setWinMultiplier] = useState(1);
  const [isCashingOut, setIsCashingOut] = useState(false); 

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

      if (boardRef.current) {
        boardRef.current.revealAllTiles();
      }
      
      endGame();
      alert('Game Over! You hit a bomb.');
    }
  };

  const handlePlaceBet = async () => {
    try {
      const response = await placeBet(customerId, betAmount);
      
      if (response.status.code === 'VALID') {
        startNewGame();
        await refreshBalance();
      } else {
        alert(`Error: ${response.status.error_message || 'Failed to place bet'}`);
      }
    } catch (error) {
      console.error('Error placing bet:', error);
      alert('Failed to place bet. Please try again.');
    }
  };

  const handleCashout = async () => {
    if (!canCashout || isCashingOut) return;
    
    try {
      setIsCashingOut(true);

      if (boardRef.current) {
        boardRef.current.revealAllTiles();
      }
      
      const winnings = Math.floor(betAmount * multiplier);
      const response = await processCashout(customerId, winnings);
      
      if (response.status.code === 'VALID') {
        setWinAmount(winnings);
        setWinMultiplier(multiplier);
        setShowWinMessage(true);
        
        setTimeout(() => {
          setShowWinMessage(false);
          endGame();
        }, 3000);
        
        await refreshBalance();
      } else {
        alert(`Error: ${response.status.error_message || 'Failed to cash out'}`);
        setIsCashingOut(false);
      }
    } catch (error) {
      console.error('Error cashing out:', error);
      alert('Failed to cash out. Please try again.');
      setIsCashingOut(false); 
    }
  };

  const startNewGame = () => {
    setOpenedTiles(0);
    setGameActive(true);
    setResetBoard(prev => !prev);
    setShowWinMessage(false);
    setIsCashingOut(false);
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
    <div className={styles.minesGame}>
      <div className={styles.gameHeader}>
        <button className={styles.backButton}>
          <img src="/arrow-vector.png" alt="arrow-image" />
        </button>
        <BalanceDisplay />
      </div>
      <div className={styles.container}>
        {gameActive && (
          <div className={styles.gameStats}>
            <p>Multiplier: {multiplier.toFixed(2)}x</p>
            <p>Potential win: {((betAmount * multiplier) / 100).toFixed(2)} EUR</p>
            {canCashout && (
              <button 
                className={styles.cashoutButton} 
                onClick={handleCashout}
                disabled={isCashingOut} 
              >
                {isCashingOut ? 'Cashing Out...' : 'Cash Out'}
              </button>
            )}
          </div>
        )}
        
        <div className={styles.boardWrapper}>
          <Board
            ref={boardRef}
            onTileReveal={handleTileReveal}
            gameActive={gameActive}
            resetGame={resetBoard}
            bombCount={3}
          />
          
          {showWinMessage && (
            <div className={styles.winOverlay}>
              <div className={styles.winMessage}>
                <div className={styles.multiplierText}>{winMultiplier.toFixed(2)}x</div>
                <div className={styles.winAmountText}>{(winAmount / 100).toFixed(2)} EUR</div>
              </div>
            </div>
          )}
        </div>
        
        {!gameActive && (
          <div className={styles.betControls}>
            <div className={styles.betAmount}>
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
            <button className={styles.betButton} onClick={handlePlaceBet}>
              Place Bet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinesGame;


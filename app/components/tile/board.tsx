"use client"

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import Tile, { TileContent } from './tile';
import styles from './board.module.css';

interface BoardProps {
  onTileReveal: (content: TileContent) => void;
  gameActive: boolean;
  resetGame: boolean;
  bombCount: number;
}


export interface BoardRef {
  revealAllTiles: () => void;
}

const Board = forwardRef<BoardRef, BoardProps>(({ 
  onTileReveal, 
  gameActive, 
  resetGame, 
  bombCount = 3 
}, ref) => {
  const [tiles, setTiles] = useState<Array<{ content: TileContent; revealed: boolean; manuallyRevealed: boolean }>>([]);


  useImperativeHandle(ref, () => ({
    revealAllTiles: () => {
      const updatedTiles = tiles.map(tile => ({
        ...tile,
        revealed: true,
       
      }));
      setTiles(updatedTiles);
    }
  }));

  useEffect(() => {
    initializeBoard();
  }, [resetGame]);

  const initializeBoard = () => {
   
    const totalTiles = 25;
    const newTiles = Array(totalTiles).fill(null).map(() => ({ 
      content: 'gem' as TileContent, 
      revealed: false,
      manuallyRevealed: false
    }));
    
  
    let bombsPlaced = 0;
    
    while (bombsPlaced < bombCount) {
      const randomIndex = Math.floor(Math.random() * totalTiles);
      
     
      if (newTiles[randomIndex].content !== 'bomb') {
        newTiles[randomIndex] = { content: 'bomb', revealed: false, manuallyRevealed: false };
        bombsPlaced++;
      }
    }
    
 
    setTiles(newTiles);
  };

  const handleTileClick = (position: number) => {
    if (!gameActive) return;
    
    const updatedTiles = [...tiles];
    const tileContent = updatedTiles[position].content;
   
    updatedTiles[position] = { 
      ...updatedTiles[position], 
      revealed: true,
      manuallyRevealed: true 
    };
    setTiles(updatedTiles);
    
    onTileReveal(tileContent);
  };

  return (
    <div className={styles.board}>
      {tiles.map((tile, index) => (
        <Tile
          key={index}
          content={tile.content}
          revealed={tile.revealed}
          manuallyRevealed={tile.manuallyRevealed}
          position={index}
          onClick={handleTileClick}
          disabled={!gameActive}
        />
      ))}
    </div>
  );
});

Board.displayName = 'Board';

export default Board;
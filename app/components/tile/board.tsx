"use client"

import React, { useState, useEffect } from 'react';
import Tile, { TileContent } from './tile';

interface BoardProps {
  onTileReveal: (content: TileContent) => void;
  gameActive: boolean;
  resetGame: boolean;
  bombCount: number;
}

const Board: React.FC<BoardProps> = ({ 
  onTileReveal, 
  gameActive, 
  resetGame, 
  bombCount = 3 
}) => {
  const [tiles, setTiles] = useState<Array<{ content: TileContent; revealed: boolean }>>([]);


  useEffect(() => {
    initializeBoard();
  }, [resetGame]);

  const initializeBoard = () => {
   
    const totalTiles = 25;
    const newTiles = Array(totalTiles).fill(null).map(() => ({ 
      content: 'gem' as TileContent, 
      revealed: false 
    }));
    
  
    let bombsPlaced = 0;
    
    while (bombsPlaced < bombCount) {
      const randomIndex = Math.floor(Math.random() * totalTiles);
      
     
      if (newTiles[randomIndex].content !== 'bomb') {
        newTiles[randomIndex] = { content: 'bomb', revealed: false };
        bombsPlaced++;
      }
    }
    
 
    setTiles(newTiles);
  };

  const handleTileClick = (position: number) => {
    if (!gameActive) return;
    
    const updatedTiles = [...tiles];
    const tileContent = updatedTiles[position].content;
   
    updatedTiles[position] = { ...updatedTiles[position], revealed: true };
    setTiles(updatedTiles);
    
   
    onTileReveal(tileContent);
  };

  return (
    <div>
      {tiles.map((tile, index) => (
        <Tile
          key={index}
          content={tile.content}
          revealed={tile.revealed}
          position={index}
          onClick={handleTileClick}
          disabled={!gameActive}
        />
      ))}
    </div>
  );
};

export default Board;
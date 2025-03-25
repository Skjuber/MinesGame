"use client"

import React from 'react';

export type TileContent = 'hidden' | 'gem' | 'bomb';

interface TileProps {
  content: TileContent;
  revealed: boolean;
  position: number;
  onClick: (position: number) => void;
  disabled: boolean;
}

const Tile: React.FC<TileProps> = ({ 
  content, 
  revealed, 
  position, 
  onClick, 
  disabled 
}) => {
  const handleClick = () => {
    if (!revealed && !disabled) {
      onClick(position);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={revealed || disabled}
    >
      {revealed ? (
        content === 'gem' ? '💎' : '💣'
      ) : (
        '?'
      )}
    </button>
  );
};

export default Tile;
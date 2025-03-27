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
      className="relative w-12 h-12 flex items-center justify-center bg-gray-200 border border-gray-400 hover:bg-gray-300 transition-colors"
    >
      {revealed ? (
        content === 'gem' ? (
          <img 
            src="/diamond.png" 
            alt="Diamond" 
            width={30} 
            height={30}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        ) : (
          <img 
            src="/bomb.png" 
            alt="Bomb" 
            width={30} 
            height={30}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        )
      ) : (
        <img 
          src="/tile.png" 
          alt="Hidden Tile" 
          width={30} 
          height={30}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}
    </button>
  );
};

export default Tile;
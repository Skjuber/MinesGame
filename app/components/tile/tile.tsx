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
      className="relative w-12 h-12 flex items-center justify-center bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors rounded-lg m-0.5"
    >
      {revealed ? (
        content === 'gem' ? (
          <img 
            src="/diamond.png" 
            alt="Diamond" 
            width={30} 
            height={30}
            style={{ maxWidth: '100%', height: 'auto', width: '100%' }}
          />
        ) : (
          <img 
            src="/bomb.png" 
            alt="Bomb" 
            width={30} 
            height={30}
            style={{ maxWidth: '100%', height: 'auto', width: '100%' }}
          />
        )
      ) : null}
    </button>
  );
};

export default Tile;
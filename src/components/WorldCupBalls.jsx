import React from 'react';

// Componente das bolas históricas das Copas do Mundo (usando SVGs numerados)
export const WorldCupBalls = {};

// Gerar as 10 bolas dinamicamente
for (let i = 1; i <= 10; i++) {
  WorldCupBalls[`ball${i}`] = (
    <img 
      src={`/balls/${i}.svg`} 
      alt={`World Cup Ball ${i}`} 
      className="w-full h-full object-contain drop-shadow-lg"
    />
  );
}

export default WorldCupBalls;

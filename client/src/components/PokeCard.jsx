import React from 'react';

export default function PokemonCard({ poke, onSelect }) {
  return (
    <div 
      className="bg-white border-2 border-transparent hover:border-red-500 rounded-2xl p-4 flex flex-col items-center cursor-pointer shadow-sm hover:shadow-xl transition-all group"
      onClick={() => onSelect(poke.id)}
    >
      <div className="bg-gray-100 mb-10 rounded-full p-2 group-hover:bg-red-50 transition-colors">
        <img 
          src={poke.image} 
          alt={poke.name} 
          className="w-24 h-24 object-contain"
        />
      </div>
      
      <h3 className="capitalize font-bold text-gray-800 text-lg">
        {poke.name}
      </h3>
    </div>
  );
};


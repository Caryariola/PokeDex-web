import React, { useState, useEffect } from 'react';
import { fetchPokemonDetails, deletePokemon } from '../services/api';
import AddPokemonForm from './PokeForms';

const PokemonDetail = ({ id, onClose, onRefresh }) => {
  const [details, setDetails] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  useEffect(() => {
    if (id) {
      fetchPokemonDetails(id).then(setDetails).catch(console.error);
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      const result = await deletePokemon(id);
      if (result) {
        onRefresh(); 
        onClose();
      }
    }
  };

  if (!details) return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
      <div className="animate-pulse text-white font-black italic text-2xl">LOADING...</div>
    </div>
  );

  const displayImage = details.isCustom 
    ? details.image 
    : details?.sprites?.other?.['official-artwork']?.front_default;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border-4 border-red-600 overflow-hidden">
        
        {/* Header - Fixed */}
        <div className="bg-red-600 p-4 flex justify-between items-center text-white shrink-0">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">{details.name}</h2>
          <button 
            onClick={onClose} 
            className="bg-white text-red-600 w-10 h-10 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 custom-scrollbar flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center bg-gray-50 rounded-3xl p-6 border-2 border-dashed border-gray-200">
              <img src={displayImage} alt={details.name} className="w-full h-auto max-w-[220px] drop-shadow-2xl" />
              {!details.isCustom && details.cries?.latest && (
                <div className="mt-6 w-full text-center">
                  <p className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Audio Cry</p>
                  <audio controls src={details.cries.latest} className="w-full h-8 scale-90" />
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <p className="text-gray-600 italic mb-6 leading-relaxed">"{details.description || "No Pokedex description found."}"</p>
              <div className="grid grid-cols-2 gap-4 text-xs bg-red-50 p-4 rounded-2xl border border-red-100">
                <p className="font-bold"><span className="text-red-400 mr-1">HT:</span> {details.height / 10}m</p>
                <p className="font-bold"><span className="text-red-400 mr-1">WT:</span> {details.weight / 10}kg</p>
                <p className="font-bold col-span-2"><span className="text-red-400 mr-1">EXP:</span> {details.base_experience}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Abilities</h3>
                <div className="flex flex-wrap gap-2">
                  {details.abilities.map(name => (
                    <span key={name} className="bg-white border-2 border-gray-100 px-3 py-1 rounded-lg text-[10px] font-black uppercase text-gray-500">{name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">Combat Stats</h3>
            <div className="space-y-4">
              {details.stats.map(s => (
                <div key={s.stat.name} className="flex items-center gap-4">
                  <span className="w-24 text-[10px] uppercase font-black text-gray-500">{s.stat.name}</span>
                  <div className="flex-1 bg-gray-100 h-3 rounded-full overflow-hidden border border-gray-200">
                    <div className="bg-red-500 h-full" style={{ width: `${(s.base_stat / 255) * 100}%` }}></div>
                  </div>
                  <span className="w-8 text-xs font-black text-red-600">{s.base_stat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer Actions - ONLY for Custom Entries */}
        {details.isCustom && (
          <div className="p-4 bg-gray-50 border-t flex gap-3 shrink-0">
            <button 
              onClick={() => setIsEditOpen(true)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-lg transition-all active:scale-95"
            >
              EDIT POKÉMON
            </button>
            <button 
              onClick={handleDelete}
              className="flex-1 bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-black shadow-lg transition-all active:scale-95"
            >
              DELETE
            </button>
          </div>
        )}
      </div>

      {isEditOpen && (
        <AddPokemonForm 
          onClose={() => setIsEditOpen(false)} 
          onRefresh={() => {
            onRefresh();
            fetchPokemonDetails(id).then(setDetails);
            setIsEditOpen(false);
          }}
          editData={details}
        />
      )}
    </div>
  );
};

export default PokemonDetail;
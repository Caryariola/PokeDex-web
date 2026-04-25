import React, { useState, useEffect } from 'react';
import { createPokemon, updatePokemon } from '../services/api';
import StatSlider from './StatSlider';

const AddPokemonForm = ({ onClose, onRefresh, editData }) => {
  const DEFAULT_IMAGE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    abilities: '',
    base_experience: 100,
    weight: 0,
    height: 0,
    image: '',
    hp: 118,
    attack: 148,
    defense: 50,
    special_attack: 50,
    special_defense: 50,
    speed: 50
  });

  const handleStatChange = (field, newValue) => {
    setFormData((prev) => ({ ...prev, [field]: newValue }));
  };

  useEffect(() => {
    if (editData) {
      const getStat = (name) => editData.stats?.find(s => s.stat.name === name)?.base_stat || 50;
      setFormData({
        ...editData,
        abilities: Array.isArray(editData.abilities) ? editData.abilities.join(', ') : editData.abilities,
        hp: getStat('hp'),
        attack: getStat('attack'),
        defense: getStat('defense'),
        special_attack: getStat('special-attack'),
        special_defense: getStat('special-defense'),
        speed: getStat('speed'),
      });
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalImage = formData.image.trim() === '' ? DEFAULT_IMAGE : formData.image;

    const payload = {
      ...formData,
      image: finalImage,
      abilities: formData.abilities.split(',').map(a => a.trim()).filter(Boolean),
      stats: [
        { base_stat: parseInt(formData.hp), stat: { name: 'hp' } },
        { base_stat: parseInt(formData.attack), stat: { name: 'attack' } },
        { base_stat: parseInt(formData.defense), stat: { name: 'defense' } },
        { base_stat: parseInt(formData.special_attack), stat: { name: 'special-attack' } },
        { base_stat: parseInt(formData.special_defense), stat: { name: 'special-defense' } },
        { base_stat: parseInt(formData.speed), stat: { name: 'speed' } },
      ],
      isCustom: true
    };

    try {
      if (editData) await updatePokemon(editData.id, payload);
      else await createPokemon(payload);
      onRefresh();
      onClose();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[120] p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl h-[90vh] flex flex-col border-[6px] border-red-600 overflow-hidden shadow-2xl">
        
        <div className="bg-red-600 p-6 shrink-0">
          <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">
            {editData ? "Modify Entry" : "New Registration"}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400">Pokémon Name</label>
              <input required className="w-full border-b-4 border-gray-100 focus:border-red-500 outline-none p-2 text-lg font-bold" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-400">Pokedex Description</label>
              <textarea required className="w-full bg-gray-50 p-3 rounded-2xl text-sm italic" 
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 space-y-4">
            <h3 className="text-[10px] font-black uppercase text-center tracking-[0.2em] text-gray-400 mb-2">Base Stats Configuration</h3>
            <StatSlider label="HP" value={formData.hp} field="hp" color="text-red-500" onChange={handleStatChange}/>
            <StatSlider label="Attack" value={formData.attack} field="attack" color="text-orange-500" onChange={handleStatChange}/>
            <StatSlider label="Defense" value={formData.defense} field="defense" color="text-yellow-500" onChange={handleStatChange} />
            <StatSlider label="Sp. Atk" value={formData.special_attack} field="special_attack" color="text-blue-500" onChange={handleStatChange}/>
            <StatSlider label="Sp. Def" value={formData.special_defense} field="special_defense" color="text-green-500" onChange={handleStatChange}/>
            <StatSlider label="Speed" value={formData.speed} field="speed" color="text-pink-500" onChange={handleStatChange}/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400">Weight (kg)</label>
              <input type="number" className="w-full border-2 p-2 rounded-xl" value={formData.weight}
                onChange={e => setFormData({...formData, weight: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400">Height (m)</label>
              <input type="number" className="w-full border-2 p-2 rounded-xl" value={formData.height}
                onChange={e => setFormData({...formData, height: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400">Abilities (Separated by commas)</label>
            <input className="w-full border-2 p-2 rounded-xl" value={formData.abilities}
              onChange={e => setFormData({...formData, abilities: e.target.value})} />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400">Sprite Image URL (Leave blank for default)</label>
            <input className="w-full border-2 p-2 rounded-xl text-xs" value={formData.image}
              placeholder="e.g. https://..."
              onChange={e => setFormData({...formData, image: e.target.value})} />
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t flex gap-4 shrink-0">
          <button type="button" onClick={onClose} className="flex-1 py-4 font-black text-gray-400 uppercase tracking-widest text-xs">Cancel</button>
          <button type="submit" onClick={handleSubmit} className="flex-[2] bg-red-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-red-700 transition-all active:scale-95">
            {editData ? "UPDATE DATABASE" : "REGISTER POKÉMON"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPokemonForm;
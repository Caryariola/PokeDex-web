import { useState, useEffect } from 'react';
import { fetchAllPokemon } from './services/api';
import PokemonCard from './components/PokeCard';
import PokemonDetail from './components/PokeDetail';
import AddPokemonForm from './components/PokeForms';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const getPokemon = async () => {
    try {
      setLoading(true);
      const data = await fetchAllPokemon();
      
      const formatted = data.results.map((p) => {
        const id = p.isCustom ? p.id : p.url.split('/').filter(Boolean).pop();
        
        return {
          name: p.name,
          id: id,
          image: p.image || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          isCustom: p.isCustom
        };
      });

      setPokemonList(formatted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPokemon();
  }, []);

  

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-red-600 p-6 text-white shadow-xl text-center sticky top-0 z-50">
        <h1 className="text-4xl font-black uppercase tracking-widest italic mb-4">Pokédex</h1>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-3 px-8 rounded-full transition-all active:scale-95 shadow-lg"
        >
          + CREATE POKÉMON
        </button>
      </header>
      
      <main className="container mx-auto py-8">
        {loading && <div className="text-center py-20 font-bold text-gray-500 animate-pulse">Loading Pokémon Data...</div>}
        {error && <div className="text-center text-red-500 font-bold bg-red-100 p-4 rounded-xl mx-4">Error: {error}</div>}

        {!loading && (
          <div className="p-8 rounded-3xl mx-auto mt-4 max-w-[1200px] border border-gray-200 bg-white shadow-sm grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4">
            {pokemonList.map((poke) => (
              <PokemonCard key={poke.id} poke={poke} onSelect={(id) => setSelectedId(id)} />
            ))}
          </div>
        )}

        {selectedId && (
          <PokemonDetail 
            id={selectedId} 
            onClose={() => setSelectedId(null)} 
            onRefresh={getPokemon} 
          />
        )}

        {isFormOpen && (
          <AddPokemonForm 
            onClose={() => setIsFormOpen(false)} 
            onRefresh={getPokemon} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
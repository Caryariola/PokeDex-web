const BASE_URL = "http://localhost:5000/api";


export const fetchAllPokemon = async () => {
  const res = await fetch(`${BASE_URL}/pokemon`);
  if (!res.ok) throw new Error("Failed to fetch Pokemon");
  return res.json();
};

export const fetchPokemonDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!res.ok) throw new Error("Failed to fetch details");
  return res.json();
};

export const createPokemon = async (pokemonData) => {
  const res = await fetch(`${BASE_URL}/pokemon`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pokemonData),
  });
  if (!res.ok) throw new Error("Failed to create Pokémon");
  return res.json();
};

export const deletePokemon = async (id) => {
  const response = await fetch(`http://localhost:5000/api/pokemon/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

export const updatePokemon = async (id, data) => {
  const res = await fetch(`${BASE_URL}/pokemon/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};
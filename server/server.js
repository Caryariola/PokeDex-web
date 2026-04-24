const express = require("express");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const app = express();
const cors = require("cors");

const PORT = 5000;
const POKEMON_FILE = path.join(__dirname, 'pokemon.json');

// Helper function to read from JSON
const readLocalData = () => {
  if (!fs.existsSync(POKEMON_FILE)) {
    fs.writeFileSync(POKEMON_FILE, JSON.stringify({ pokemon: [] }));
  }
  const data = fs.readFileSync(POKEMON_FILE, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write to JSON
const writeLocalData = (data) => {
  fs.writeFileSync(POKEMON_FILE, JSON.stringify(data, null, 2));
};

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// --- GET ALL POKEMON ---
app.get("/api/pokemon", async (req, res) => {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=30");
    const data = await response.json();
    const localData = readLocalData();
    const combined = [...localData.pokemon, ...data.results];
    res.json({ results: combined });
  } catch (error) {
    res.status(500).json({ message: "Error merging data" });
  }
});

// --- GET SINGLE POKEMON DETAILS ---
app.get("/api/pokemon/:id", async (req, res) => {
  const { id } = req.params;

  if (id.startsWith('custom-')) {
    const localData = readLocalData();
    const customPoke = localData.pokemon.find(p => p.id === id);
    if (customPoke) return res.json(customPoke);
    return res.status(404).json({ message: "Custom Pokémon not found" });
  }

  try {
    const [pokeRes, speciesRes] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    ]);

    const pokeData = await pokeRes.json();
    const speciesData = await speciesRes.json();

    const description = speciesData.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    )?.flavor_text.replace(/\f/g, " ");

    res.json({
      id: pokeData.id,
      name: pokeData.name,
      sprites: pokeData.sprites,
      weight: pokeData.weight,
      height: pokeData.height,
      base_experience: pokeData.base_experience,
      stats: pokeData.stats,
      abilities: pokeData.abilities.map(a => a.ability.name),
      cries: pokeData.cries,
      description: description,
      isCustom: false
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching details" });
  }
});

// --- CREATE POKEMON ---
app.post("/api/pokemon", (req, res) => {
  try {
    const localData = readLocalData();
    const newPokemon = {
      id: `custom-${Date.now()}`,
      ...req.body,
      isCustom: true
    };
    localData.pokemon.push(newPokemon);
    writeLocalData(localData);
    res.status(201).json(newPokemon);
  } catch (error) {
    res.status(500).json({ message: "Failed to create Pokémon" });
  }
});

// --- UPDATE POKEMON (NEW) ---
app.put("/api/pokemon/:id", (req, res) => {
  const { id } = req.params;
  try {
    let localData = readLocalData();
    const index = localData.pokemon.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Custom Pokémon not found" });
    }

    // Update the Pokémon at that index with new data from req.body
    localData.pokemon[index] = { 
      ...localData.pokemon[index], // Keep the original ID
      ...req.body,                 // Overwrite with new data
      id: id,                      // Ensure ID doesn't change
      isCustom: true 
    };

    writeLocalData(localData);
    res.json(localData.pokemon[index]);
  } catch (error) {
    res.status(500).json({ message: "Failed to update Pokémon" });
  }
});

// --- DELETE POKEMON ---
app.delete("/api/pokemon/:id", (req, res) => {
  const { id } = req.params;
  try {
    let localData = readLocalData();
    const exists = localData.pokemon.some(p => p.id === id);
    
    if (!exists) {
      return res.status(404).json({ message: "Pokémon not found" });
    }

    localData.pokemon = localData.pokemon.filter(p => p.id !== id);
    writeLocalData(localData); 
    res.json({ message: "Deleted successfully", id });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Pokémon" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
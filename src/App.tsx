import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import CharacterCreation from "./pages/CharacterCreation";
import HogwartsLetter from "./pages/HogwartsLetter";
import DiagonAlley from "./pages/DiagonAlley";
import HogwartsExpress from "./pages/HogwartsExpress";
import HomePage from "./pages/HomePage";
import School from "./pages/School";
import CharacterSheet from "./pages/CharacterSheet";
import Inventory from "./pages/Inventory";
import RequireWandAndRobes from "./components/RequireWandAndRobes";
import { Character } from "./types";

function App() {
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCharacter() {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("characters")
          .select("*")
          .limit(1);

        if (error) {
          setError("Error loading character: " + error.message);
        } else if (!data || data.length === 0) {
          setActiveCharacter(null);
        } else {
          setActiveCharacter(data[0]);
        }
      } catch (e: any) {
        setError("Unexpected error: " + (e?.message || e));
      } finally {
        setLoading(false);
      }
    }
    fetchCharacter();
  }, []);

  if (loading) return <div style={{ padding: 32, textAlign: "center" }}>Loading character...</div>;

  if (error) return (
    <div style={{ color: "crimson", padding: 32, textAlign: "center" }}>
      {error}
      <br />
      <button onClick={() => window.location.reload()} style={{ marginTop: 16 }}>Retry</button>
    </div>
  );

  // If there's no character, direct to character creation
  if (!activeCharacter) {
    return (
      <Router>
        <Routes>
          <Route path="/*" element={<Navigate to="/character-creation" replace />} />
          <Route path="/character-creation" element={<CharacterCreation onCharacterCreated={setActiveCharacter} />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/hogwarts-letter" replace />} />
        <Route path="/character-creation" element={<CharacterCreation onCharacterCreated={setActiveCharacter} />} />
        <Route path="/hogwarts-letter" element={<HogwartsLetter character={activeCharacter} />} />
        <Route path="/diagon-alley" element={<DiagonAlley character={activeCharacter} />} />
        <Route
          path="/hogwarts-express"
          element={
            <RequireWandAndRobes characterId={activeCharacter.id}>
              <HogwartsExpress character={activeCharacter} />
            </RequireWandAndRobes>
          }
        />
        <Route path="/home" element={<HomePage character={activeCharacter} />} />
        <Route path="/school" element={<School character={activeCharacter} />} />
        <Route path="/character-sheet" element={<CharacterSheet character={activeCharacter} />} />
        <Route path="/inventory" element={<Inventory character={activeCharacter} />} />
      </Routes>
    </Router>
  );
}

export default App;

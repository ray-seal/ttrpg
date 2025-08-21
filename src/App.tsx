import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import DiagonAlley from "./pages/DiagonAlley";
import Ollivanders from "./pages/Ollivanders";
import MadamMalkins from "./pages/MadamMalkins";
import HogwartsExpress from "./pages/HogwartsExpress";
import RequireWandAndRobes from "./components/RequireWandAndRobes";
import CharacterCreation from "./pages/CharacterCreation";
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

  // Show CharacterCreation if no character exists
  if (!activeCharacter) return (
    <CharacterCreation onCharacterCreated={setActiveCharacter} />
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/diagon-alley" replace />} />
        <Route path="/character-creation" element={
          <CharacterCreation onCharacterCreated={setActiveCharacter} />
        } />
        <Route path="/diagon-alley" element={
          <DiagonAlley character={activeCharacter} />
        } />
        <Route path="/ollivanders" element={
          <Ollivanders character={activeCharacter} setCharacter={setActiveCharacter} />
        } />
        <Route path="/madam-malkins" element={
          <MadamMalkins character={activeCharacter} setCharacter={setActiveCharacter} />
        } />
        <Route path="/hogwarts-express" element={
          <RequireWandAndRobes characterId={activeCharacter.id}>
            <HogwartsExpress character={activeCharacter} />
          </RequireWandAndRobes>
        } />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;

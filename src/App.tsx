import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import DiagonAlley from "./pages/DiagonAlley";
import Ollivanders from "./pages/Ollivanders";
import MadamMalkins from "./pages/MadamMalkins";
import HogwartsExpress from "./pages/HogwartsExpress";
import RequireWandAndRobes from "./components/RequireWandAndRobes";
import { Character } from "./types";

function App() {
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null);

  // Fetch active character on mount or setup logic here
  useEffect(() => {
    // For demo: fetch first character (replace with your own logic)
    async function fetchCharacter() {
      const { data } = await supabase
        .from("characters")
        .select("*")
        .limit(1)
        .single();
      setActiveCharacter(data);
    }
    fetchCharacter();
  }, []);

  if (!activeCharacter) return <div>Loading character...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to="/diagon-alley" replace />
          }
        />
        <Route
          path="/diagon-alley"
          element={
            <DiagonAlley character={activeCharacter} />
          }
        />
        <Route
          path="/ollivanders"
          element={
            <Ollivanders character={activeCharacter} setCharacter={setActiveCharacter} />
          }
        />
        <Route
          path="/madam-malkins"
          element={
            <MadamMalkins character={activeCharacter} setCharacter={setActiveCharacter} />
          }
        />
        <Route
          path="/hogwarts-express"
          element={
            <RequireWandAndRobes characterId={activeCharacter.id}>
              <HogwartsExpress character={activeCharacter} />
            </RequireWandAndRobes>
          }
        />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;

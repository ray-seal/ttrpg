import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import HomePage from "./pages/HomePage";
import CharacterCreation from "./pages/CharacterCreation";
import HogwartsLetter from "./pages/HogwartsLetter";
import HogwartsSupplyList from "./pages/HogwartsSupplyList";
import DiagonAlley from "./pages/DiagonAlley";
import GringottsBank from "./pages/GringottsBank";
import Ollivanders from "./pages/Ollivanders";
import MadamMalkins from "./pages/MadamMalkins";
import Inventory from "./pages/Inventory";
import HogwartsExpress from "./pages/HogwartsExpress";
import SortingHat from "./pages/SortingHat";
import CharacterSheet from "./pages/CharacterSheet";
import School from "./pages/School";
import SchoolGate from "./components/SchoolGate";
import ThemedLayout from "./components/ThemedLayout";
import Spellbook from "./pages/Spellbook";
import LumosLesson from "./pages/LumosLesson";
import AlohomoraLesson from "./pages/AlohomoraLesson";
import WingardiumLeviosaLesson from "./pages/WingardiumLeviosaLesson";
import Detentions from "./pages/Detentions";
import RequireWandAndRobes from "./components/RequireWandAndRobes";
import AuthWizard from "./pages/AuthWizard";
import Login from "./pages/Login";

// --- Real session hook using Supabase Auth ---
function useSession() {
  const [session, setSession] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let authListener;
    async function getCurrentSession() {
      // For Supabase JS v2
      if (supabase.auth.getSession) {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUserId(session?.user?.id || null);
      } else {
        // For v1
        const session = supabase.auth.session();
        setSession(session);
        setUserId(session?.user?.id || null);
      }
    }
    getCurrentSession();

    authListener = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUserId(session?.user?.id || null);
    });

    return () => {
      if (authListener?.data?.subscription) {
        authListener.data.subscription.unsubscribe();
      }
    };
  }, []);

  return { session, userId };
}

const fetchCharacterWithItems = async (userId) => {
  const { data: character, error } = await supabase
    .from("characters")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!character) return null;

  // Fetch items
  const { data: items } = await supabase
    .from("character_items")
    .select("*")
    .eq("character_id", character.id);

  return { ...character, items: items || [] };
};

function App() {
  const { session, userId } = useSession();
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load character and items on login/session/userId change
  useEffect(() => {
    async function loadCharacter() {
      if (session && userId) {
        setLoading(true);
        const character = await fetchCharacterWithItems(userId);
        setActiveCharacter(character);
        setLoading(false);
      } else {
        setActiveCharacter(null);
        setLoading(false);
      }
    }
    loadCharacter();
  }, [session, userId]);

  // Make sure to always refresh items after any character update
  const handleUpdateCharacter = async (newChar) => {
    const { data: items } = await supabase
      .from("character_items")
      .select("*")
      .eq("character_id", newChar.id);
    setActiveCharacter({ ...newChar, items: items || [] });
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: 60 }}>Loading...</div>;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            hasCharacter={!!activeCharacter}
            character={activeCharacter}
            session={session}
          />
        }
      />
      <Route path="/signup" element={<AuthWizard />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/character-creation"
        element={
          <CharacterCreation
            userId={userId}
            onCreate={handleUpdateCharacter}
          />
        }
      />
      <Route
        path="/hogwarts-letter"
        element={
          activeCharacter ? (
            <HogwartsLetter character={activeCharacter} setCharacter={handleUpdateCharacter} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/hogwarts-supply-list"
        element={
          activeCharacter ? (
            <HogwartsSupplyList />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/diagon-alley"
        element={
          activeCharacter ? (
            <DiagonAlley character={activeCharacter} onComplete={() => window.location.href = "/hogwarts-express"} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/gringotts-bank"
        element={
          activeCharacter ? (
            <GringottsBank character={activeCharacter} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/ollivanders"
        element={
          activeCharacter ? (
            <Ollivanders character={activeCharacter} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/madam-malkins"
        element={
          activeCharacter ? (
            <MadamMalkins character={activeCharacter} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/inventory"
        element={
          activeCharacter ? (
            <Inventory character={activeCharacter} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/hogwarts-express"
        element={
          activeCharacter ? (
            <RequireWandAndRobes characterId={activeCharacter.id}>
              <HogwartsExpress character={activeCharacter} />
            </RequireWandAndRobes>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/sorting-hat"
        element={
          activeCharacter ? (
            <SortingHat
              character={activeCharacter}
              onSorted={async () => {
                // Refetch character after sorting
                const updated = await fetchCharacterWithItems(userId);
                setActiveCharacter(updated);
                window.location.href = "/character-sheet";
              }}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/character-sheet"
        element={
          activeCharacter ? (
            <CharacterSheet character={activeCharacter} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/school"
        element={
          activeCharacter ? (
            <SchoolGate character={activeCharacter}>
              <ThemedLayout character={activeCharacter}>
                <School character={activeCharacter} setCharacter={handleUpdateCharacter} />
              </ThemedLayout>
            </SchoolGate>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/spellbook"
        element={
          activeCharacter ? (
            <Spellbook character={activeCharacter} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      {/* Lessons: Always pass character and setCharacter */}
      <Route
        path="/wingardium-leviosa-lesson"
        element={
          activeCharacter ? (
            <WingardiumLeviosaLesson character={activeCharacter} setCharacter={handleUpdateCharacter} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/alohomora-lesson"
        element={
          activeCharacter ? (
            <AlohomoraLesson character={activeCharacter} setCharacter={handleUpdateCharacter} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/lumos-lesson"
        element={
          activeCharacter ? (
            <LumosLesson character={activeCharacter} setCharacter={handleUpdateCharacter} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/detentions"
        element={
          activeCharacter ? (
            <Detentions character={activeCharacter} setCharacter={handleUpdateCharacter} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

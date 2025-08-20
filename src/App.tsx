import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import CharacterCreation from "./pages/CharacterCreation";
import CharacterSheet from "./pages/CharacterSheet";
import HomePage from "./pages/HomePage";
import { houseThemes, House } from "./themes";
import { Character } from "./types";
import DiceButton from "./components/DiceButton";
import ThemedLayout from "./components/ThemedLayout";
import School from "./pages/School";
import SpellBook from "./pages/Spellbook";
import AuthWizard from "./pages/AuthWizard";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import HogwartsLetter from "./pages/HogwartsLetter";
import HogwartsSupplyList from "./pages/HogwartsSupplyList";
import DiagonAlley from "./pages/DiagonAlley";
import GringottsBank from "./pages/GringottsBank";
import Ollivanders from "./pages/Ollivanders";
import MadamMalkins from "./pages/MadamMalkins";

const CHARACTER_KEY = "activeCharacterId";
const RESET_PHRASE = "reset-my-game";

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetInput, setResetInput] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUserId(data.session?.user.id ?? null);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUserId(session?.user.id ?? null);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setCharacters([]);
      setActiveCharacterId(null);
      return;
    }
    setLoading(true);
    supabase
      .from("characters")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setCharacters(data || []);
        const stored = localStorage.getItem(CHARACTER_KEY);
        if (stored && data?.some(c => c.id === stored)) {
          setActiveCharacterId(stored);
        } else if (data && data.length > 0) {
          setActiveCharacterId(data[0].id);
        } else {
          setActiveCharacterId(null);
        }
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    if (activeCharacterId) localStorage.setItem(CHARACTER_KEY, activeCharacterId);
  }, [activeCharacterId]);

  function handleCreateCharacter(newChar: Character) {
    setCharacters((prev) => [...prev, newChar]);
    setActiveCharacterId(newChar.id);
  }
  function handleSelectCharacter(id: string) {
    setActiveCharacterId(id);
  }
  function handleUpdateCharacter(updatedChar: Character) {
    setCharacters(chars => chars.map(c => (c.id === updatedChar.id ? updatedChar : c)));
    if (updatedChar.id === activeCharacterId) {
      setActiveCharacterId(updatedChar.id);
    }
  }
  function handleReset() {
    if (!activeCharacterId) return;
    supabase.from("characters").delete().eq("id", activeCharacterId).then(() => {
      setCharacters(chars => chars.filter(c => c.id !== activeCharacterId));
      setActiveCharacterId(null);
      localStorage.removeItem(CHARACTER_KEY);
      setResetInput("");
    });
  }
  const activeCharacter = characters.find(c => c.id === activeCharacterId) || null;
  const currentHouse = activeCharacter?.house as House | undefined;
  const theme = currentHouse ? houseThemes[currentHouse] : houseThemes.Gryffindor;

  // Gating: must have both wand and robes before school is accessible
  const hasWand = async (character: Character) => {
    const { data } = await supabase
      .from("character_items")
      .select("id")
      .eq("character_id", character.id)
      .eq("item_id", "9c1c1a36-8f3f-4c0e-b9b1-222222222222") // wand UUID
      .maybeSingle();
    return !!data;
  };
  const hasRobes = async (character: Character) => {
    const { data } = await supabase
      .from("character_items")
      .select("id")
      .eq("character_id", character.id)
      .eq("item_id", "37e9c6fb-3f81-4d7d-9c3c-444444444444") // robes UUID
      .maybeSingle();
    return !!data;
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "monospace"
      }}>
        <h2>Loading Hogwarts Adventure...</h2>
      </div>
    );
  }

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
            userId={userId!}
            onCreate={handleCreateCharacter}
          />
        }
      />
      <Route
        path="/hogwarts-letter"
        element={
          activeCharacter ? (
            <HogwartsLetter character={activeCharacter} />
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
            <DiagonAlley />
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
      {/* Gated: Only allow school if player has both wand and robes */}
      <Route
        path="/school"
        element={
          activeCharacter ? (
            <ThemedLayout character={activeCharacter}>
              <School character={activeCharacter} setCharacter={handleUpdateCharacter} />
            </ThemedLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/spellbook"
        element={
          activeCharacter ? (
            <ThemedLayout character={activeCharacter}>
              <SpellBook character={activeCharacter} setCharacter={handleUpdateCharacter} />
            </ThemedLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      {/* Add other routes as needed */}
      <Route path="*" element={<Navigate to="/signup" />} />
    </Routes>
  );
}

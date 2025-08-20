import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";
import CharacterCreation from "./pages/CharacterCreation";
import CharacterSheet from "./pages/CharacterSheet";
import HomePage from "./pages/HomePage";
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
import SchoolGate from "./components/SchoolGate";
import SortingHat from "./pages/SortingHat";
import HogwartsExpress from "./pages/HogwartsExpress";
import AlohomoraLesson from "./pages/AlohomoraLesson";
import WingardiumLeviosaLesson from "./pages/WingardiumLeviosaLesson";
import LumosLesson from "./pages/LumosLesson";

const CHARACTER_KEY = "activeCharacterId";

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [characters, setCharacters] = useState<any[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

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

  function handleCreateCharacter(newChar: any) {
    setCharacters((prev) => [...prev, newChar]);
    setActiveCharacterId(newChar.id);
  }
  function handleUpdateCharacter(updatedChar: any) {
    setCharacters(chars => chars.map(c => (c.id === updatedChar.id ? updatedChar : c)));
    if (updatedChar.id === activeCharacterId) setActiveCharacterId(updatedChar.id);
  }

  const activeCharacter = characters.find(c => c.id === activeCharacterId) || null;

  // Wait for loading
  if (loading) {
    return <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "monospace"
    }}><h2>Loading Hogwarts Adventure...</h2></div>;
  }

  // Not logged in? Go to signup/login
  if (!session && location.pathname !== "/signup" && location.pathname !== "/login") {
    return <Navigate to="/signup" replace />;
  }

  // No character? Force creation
  if (session && !activeCharacter && location.pathname !== "/character-creation") {
    return <Navigate to="/character-creation" replace />;
  }

  // Check character status for onboarding
  const missingName = !activeCharacter?.name;
  const missingSorting =
    !activeCharacter?.house ||
    activeCharacter.magic == null ||
    activeCharacter.knowledge == null ||
    activeCharacter.courage == null ||
    activeCharacter.agility == null ||
    activeCharacter.charisma == null;
  const letterRead = !!activeCharacter?.letter_read;

  // Should see letter if: name present, not sorted, and letter_read is false
  if (
    session &&
    activeCharacter &&
    !missingName &&
    missingSorting &&
    !letterRead &&
    location.pathname !== "/hogwarts-letter"
  ) {
    return <Navigate to="/hogwarts-letter" replace />;
  }

  // After reading letter, go to Diagon Alley
  if (
    session &&
    activeCharacter &&
    !missingName &&
    missingSorting &&
    letterRead &&
    ["/hogwarts-letter", "/signup", "/login", "/character-creation"].includes(location.pathname)
  ) {
    return <Navigate to="/diagon-alley" replace />;
  }

  // After sorting, never show onboarding steps again, but only redirect if on onboarding path
  if (
    session &&
    activeCharacter &&
    !missingName &&
    !missingSorting &&
    ["/signup", "/login", "/character-creation", "/hogwarts-letter", "/hogwarts-express", "/sorting-hat", "/diagon-alley"].includes(location.pathname)
  ) {
    return <Navigate to="/character-sheet" replace />;
  }

  // All other pages: allow refresh to land on correct page!
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
            <HogwartsExpress character={activeCharacter} />
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
              onSorted={() => {
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
      {/* Lesson routes */}
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
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import CharacterCreation from "./pages/CharacterCreation";
import CharacterSheet from "./pages/CharacterSheet";
import HomePage from "./pages/HomePage";
import { houseThemes, House } from "./themes";
import { Character } from "./types";
import DiceButton from "./components/DiceButton";
import HouseShield from "./components/HouseShield";
import AlohomoraLesson from "./pages/AlohomoraLesson";
import WingardiumLeviosaLesson from "./pages/WingardiumLeviosaLesson";
import LumosLesson from "./pages/LumosLesson";
import School from "./pages/School";
import ThemedLayout from "./components/ThemedLayout";
import SpellBook from "./pages/Spellbook";
import CampaignPage from "./pages/CampaignPage";
import PeevesPests from "./pages/PeevesPests";
import Detentions from "./pages/Detentions";
import AuthWizard from "./pages/AuthWizard";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import HogwartsLetter from "./pages/HogwartsLetter";
import HogwartsSupplyList from "./pages/HogwartsSupplyList";
import DiagonAlley from "./pages/DiagonAlley";
// (Add more Diagon Alley shop imports as you create them)

const CHARACTER_KEY = "activeCharacterId";
const RESET_PHRASE = "reset-my-game";

function getAllowedDice(character: Character | null): number[] {
  if (!character) return [4, 6, 8, 10, 12, 20];
  if (character.magic <= 6) return [4, 6];
  if (character.magic <= 8) return [4, 6, 8];
  if (character.magic >= 10) return [4, 6, 8, 10, 12, 20];
  return [4, 6, 8, 10, 12, 20];
}

function hasUnlockedLumos(character: Character) {
  return !!(character.flags && character.flags.school_termtwo);
}

const App: React.FC = () => {
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

  useEffect(() => {
    let metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute("content", theme.primary);
  }, [theme]);

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
          !activeCharacter ? (
            <CharacterCreation
              userId={userId!}
              characters={characters}
              onCreate={handleCreateCharacter}
              onSelectCharacter={handleSelectCharacter}
            />
          ) : (
            <Navigate to="/character-sheet" replace />
          )
        }
      />
      <Route
        path="/character-sheet"
        element={
          activeCharacter ? (
            <ThemedLayout character={activeCharacter}>
              <h1 style={{ color: "inherit", textAlign: "center" }}>
                Harry Potter TTRPG
              </h1>
              <CharacterSheet
                character={activeCharacter}
                setCharacter={handleUpdateCharacter}
                onSwitchCharacter={handleSelectCharacter}
                onDeleteCharacter={handleReset}
                characters={characters}
              />
              <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <label htmlFor="reset-input" style={{ marginRight: "1rem" }}>
                  Type "<b>{RESET_PHRASE}</b>" to reset this character:
                </label>
                <input
                  id="reset-input"
                  type="text"
                  value={resetInput}
                  onChange={(e) => setResetInput(e.target.value)}
                  style={{
                    padding: "0.5rem",
                    fontSize: "1rem",
                    marginRight: "1rem",
                  }}
                  autoComplete="off"
                />
                <button
                  onClick={handleReset}
                  disabled={resetInput !== RESET_PHRASE}
                  style={{
                    background:
                      resetInput === RESET_PHRASE ? "#b71c1c" : "#e0e0e0",
                    color: resetInput === RESET_PHRASE ? "#fff" : "#888",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.5rem 1rem",
                    cursor:
                      resetInput === RESET_PHRASE
                        ? "pointer"
                        : "not-allowed",
                    fontWeight: "bold",
                  }}
                >
                  Reset Character
                </button>
              </div>
              <DiceButton allowedDice={getAllowedDice(activeCharacter)} />
            </ThemedLayout>
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
      {/* Hogwarts Letter and supply list routes */}
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
      {/* Add more Diagon Alley shop routes here as you implement them */}
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
        path="/school/alohomora-lesson"
        element={
          activeCharacter ? (
            <ThemedLayout character={activeCharacter}>
              <AlohomoraLesson character={activeCharacter} setCharacter={handleUpdateCharacter} />
            </ThemedLayout>
          ) : (
            <Navigate to="/school" replace />
          )
        }
      />
      <Route
        path="/school/lumos-lesson"
        element={
          activeCharacter && hasUnlockedLumos(activeCharacter) ? (
            <ThemedLayout character={activeCharacter}>
              <LumosLesson
                character={activeCharacter}
                unlockedSpells={activeCharacter.completedLessons || []}
                setCharacter={handleUpdateCharacter}
              />
            </ThemedLayout>
          ) : (
            <Navigate to="/school" replace />
          )
        }
      />
      <Route
        path="/school/wingardium-leviosa-lesson"
        element={
          activeCharacter ? (
            <ThemedLayout character={activeCharacter}>
              <WingardiumLeviosaLesson character={activeCharacter} setCharacter={handleUpdateCharacter} />
            </ThemedLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/peeves-pests"
        element={
          activeCharacter ? (
            <ThemedLayout character={activeCharacter}>
              <PeevesPests character={activeCharacter} setCharacter={handleUpdateCharacter} />
            </ThemedLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/detentions"
        element={
          activeCharacter ? (
            <ThemedLayout character={activeCharacter}>
              <Detentions character={activeCharacter} setCharacter={handleUpdateCharacter} />
            </ThemedLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/campaign"
        element={
          activeCharacter ? (
            <ThemedLayout character={activeCharacter}>
              <CampaignPage character={activeCharacter} setCharacter={handleUpdateCharacter} />
            </ThemedLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/help"
        element={
          activeCharacter ? (
            <ThemedLayout character={activeCharacter}>
              <div
                style={{
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "monospace",
                }}
              >
                <h2>Help</h2>
                <p>Coming soon!</p>
                <a href="/" style={{ marginTop: "2rem" }}>Back to Home</a>
              </div>
            </ThemedLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/signup" />} />
    </Routes>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import Login from "./pages/Login"; // <-- create this page if not already

const CHARACTER_KEY = "character";

function loadCharacter(): Character | null {
  const saved = localStorage.getItem(CHARACTER_KEY);
  return saved ? JSON.parse(saved) : null;
}

function saveCharacter(char: Character) {
  localStorage.setItem(CHARACTER_KEY, JSON.stringify(char));
}

function getAllowedDice(character: Character | null): number[] {
  if (!character) return [4, 6, 8, 10, 12, 20];
  if (character.magic <= 6) return [4, 6];
  if (character.magic <= 8) return [4, 6, 8];
  if (character.magic >= 10) return [4, 6, 8, 10, 12, 20];
  return [4, 6, 8, 10, 12, 20];
}

const RESET_PHRASE = "reset-my-game";

// Returns total XP required to reach the given level (level 1 = 0 XP, level 2 = 100 XP, level 3 = 300 XP, ...)
function getTotalXpForLevel(level: number): number {
  let xp = 0;
  for (let l = 1; l < level; l++) {
    xp += l * 100;
  }
  return xp;
}

// Calculates the character's level based on total XP
function getLevelForExperience(exp: number): number {
  let level = 1;
  while (exp >= getTotalXpForLevel(level + 1)) {
    level += 1;
  }
  return level;
}

// Helper to check if school_termtwo flag is set
function hasUnlockedLumos(character: Character) {
  return !!(character.flags && character.flags.school_termtwo);
}

const App: React.FC = () => {
  const [character, setCharacter] = useState<Character | null>(loadCharacter());
  const [resetInput, setResetInput] = useState("");

  useEffect(() => {
    if (character) saveCharacter(character);
  }, [character]);

  const currentHouse = character?.house as House | undefined;
  const theme = currentHouse ? houseThemes[currentHouse] : houseThemes.Gryffindor;

  // Dynamically update the PWA/browser theme color based on the current house
  useEffect(() => {
    let metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute("content", theme.primary);
  }, [theme]);

  function addExperience(points: number) {
    setCharacter((prev) => {
      if (!prev) return prev;
      const newExp = prev.experience + points;
      const newLevel = getLevelForExperience(newExp);
      return { ...prev, experience: newExp, level: newLevel };
    });
  }

  function handleReset() {
    localStorage.clear();
    setCharacter(null);
    setResetInput("");
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage hasCharacter={!!character} />}
      />
      <Route
        path="/signup"
        element={<AuthWizard />}
      />
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/character-creation"
        element={
          !character ? (
            <CharacterCreation onCreate={setCharacter} />
          ) : (
            <Navigate to="/character-sheet" replace />
          )
        }
      />
      <Route
        path="/character-sheet"
        element={
          character ? (
            <ThemedLayout character={character}>
              <h1 style={{ color: "inherit", textAlign: "center" }}>
                Harry Potter TTRPG
              </h1>
              <CharacterSheet character={character} setCharacter={setCharacter} />
              {/* Reset game section */}
              <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <label htmlFor="reset-input" style={{ marginRight: "1rem" }}>
                  Type "<b>{RESET_PHRASE}</b>" to reset your game:
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
                  Reset Game
                </button>
              </div>
              <DiceButton allowedDice={getAllowedDice(character)} />
            </ThemedLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/spellbook"
        element={
          character ? (
            <ThemedLayout character={character}>
              <SpellBook character={character} setCharacter={setCharacter} />
            </ThemedLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/school"
        element={
          character && character.hasTimetable ? (
            <ThemedLayout character={character}>
              <School character={character} setCharacter={setCharacter} />
            </ThemedLayout>
          ) : (
            <Navigate to="/campaign" />
          )
        }
      />
      <Route
        path="/school/alohomora-lesson"
        element={
          character ? (
            <ThemedLayout character={character}>
              <AlohomoraLesson character={character} setCharacter={setCharacter} />
            </ThemedLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/school/lumos-lesson"
        element={
          character && hasUnlockedLumos(character) ? (
            <ThemedLayout character={character}>
              <LumosLesson
                character={character}
                unlockedSpells={character.completedLessons || []}
                setCharacter={setCharacter}
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
          character ? (
            <ThemedLayout character={character}>
              <WingardiumLeviosaLesson character={character} setCharacter={setCharacter} />
            </ThemedLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/peeves-pests"
        element={
          character ? (
            <ThemedLayout character={character}>
              <PeevesPests character={character} setCharacter={setCharacter} />
            </ThemedLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/detentions"
        element={
          character ? (
            <ThemedLayout character={character}>
              <Detentions character={character} setCharacter={setCharacter} />
            </ThemedLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/campaign"
        element={
          character ? (
            <ThemedLayout character={character}>
              <CampaignPage character={character} setCharacter={setCharacter} />
            </ThemedLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/help"
        element={
          character ? (
            <ThemedLayout character={character}>
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
      {/* Fallback: go to signup */}
      <Route path="*" element={<Navigate to="/signup" />} />
    </Routes>
  );
};

export default App;

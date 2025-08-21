import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Character } from "../types";
import { houseThemes } from "../themes";
import DiceButton from "../components/DiceButton";
import SpellBook from "./Spellbook";
import { supabase } from "../supabaseClient";

// Timetable item id constant
const YEAR_ONE_TIMETABLE_ID = "b7a8e1a9-bd62-4d50-8e2a-111111111111";

const STANDARD_BOOK = "Standard Book of Spells Grade 1";
const GRADE1_SPELLS = [
  "Alohomora",
  "Lumos",
  "Wingardium Leviosa",
  "Incendio",
  "Nox"
];

interface Props {
  character: Character;
  setCharacter: (c: Character) => void;
}

const AlohomoraLesson: React.FC<Props> = ({ character, setCharacter }) => {
  const theme = houseThemes[character.house];
  const navigate = useNavigate();

  // --- GUARD: Require Year One Timetable to access lesson ---
  if (
    !character.items ||
    !character.items.some((item) => item.item_id === YEAR_ONE_TIMETABLE_ID)
  ) {
    return (
      <div
        style={{
          maxWidth: 400,
          margin: "4rem auto",
          padding: "2rem",
          background: "#fffbe9",
          borderRadius: 12,
          textAlign: "center",
          border: "2px solid #e3ce7d",
          color: "#222",
          fontSize: "1.3rem",
        }}
      >
        <h2>Access Restricted</h2>
        <p>
          You need your <strong>Year One Timetable</strong> before you can attend this lesson.
        </p>
        <button
          style={{
            marginTop: "1.2rem",
            padding: "0.6em 1.5em",
            borderRadius: 8,
            border: "2px solid #e3ce7d",
            background: "#f8e7b8",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "1rem",
          }}
          onClick={() => navigate("/school")}
        >
          Return to School
        </button>
      </div>
    );
  }

  const completed = (character.completedLessons ?? []).includes("Alohomora");
  const [step, setStep] = useState<"intro"|"select"|"roll"|"result"|"wrong">("intro");
  const [spellbookOpen, setSpellbookOpen] = useState(false);
  const [diceModalOpen, setDiceModalOpen] = useState(false);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  async function markSpellLearnt() {
    // Add spell to character_spells if not already present
    await supabase
      .from("character_spells")
      .upsert([
        { character_id: character.id, spell: "Alohomora" }
      ], { onConflict: ["character_id", "spell"] });

    // Update character experience and completedLessons
    const newCompleted = Array.from(new Set([...(character.completedLessons ?? []), "Alohomora"]));
    const newExp = (character.experience ?? 0) + 10;
    setCharacter({
      ...character,
      completedLessons: newCompleted,
      experience: newExp,
    });
    await supabase.from("characters").update({
      completedLessons: newCompleted,
      experience: newExp
    }).eq("id", character.id);
  }

  function handleSpellClick(spell: string) {
    if (spell === "Alohomora") {
      setSpellbookOpen(false);
      setStep("roll");
    } else {
      setSpellbookOpen(false);
      setStep("wrong");
    }
  }

  async function handleDiceRoll(result: number, sides: number) {
    if (sides !== 12) return;
    const total = result + character.magic;
    setRollResult(total);
    const passed = total >= 12;
    setSuccess(passed);
    if (passed && !completed) {
      await markSpellLearnt();
    }
    setDiceModalOpen(false);
    setStep("result");
  }

  return (
    <div
      style={{
        border: `2px solid ${theme.secondary}`,
        background: "rgba(255,255,255,0.60)",
        color: theme.primary,
        padding: "2rem",
        borderRadius: "16px",
        maxWidth: "420px",
        margin: "2rem auto",
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        fontFamily: "serif",
        position: "relative"
      }}
    >
      <h2 style={{ color: theme.secondary, marginBottom: "0.5rem" }}>
        Professor Flitwick's Charms Class
      </h2>
      <h3>Lesson: Alohomora</h3>
      {step === "intro" && (
        <>
          <p>
            Professor Flitwick beams, "Welcome! Today you'll learn <b>Alohomora</b>.<br />
            Open your <b>Standard Book of Spells Grade 1</b> and select the unlocking charm!"
          </p>
          <button
            style={{
              background: theme.primary,
              color: "#fff",
              padding: "0.8rem 2rem",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              cursor: "pointer"
            }}
            onClick={() => setStep("select")}
          >
            I'm ready
          </button>
        </>
      )}

      {step === "select" && (
        <p>
          Professor Flitwick: "Which spell will open a locked door? Open your spellbook and select it!"
        </p>
      )}

      {step === "wrong" && (
        <>
          <p>
            Professor Flitwick shakes his head. <b>"That's not quite right, try again!"</b>
          </p>
          <button
            style={{
              background: theme.primary,
              color: "#fff",
              padding: "0.8rem 2rem",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              cursor: "pointer"
            }}
            onClick={() => setStep("select")}
          >
            Try again
          </button>
        </>
      )}

      {step === "roll" && (
        <>
          <p>
            Professor Flitwick: "Excellent! Now, roll a <b>d12</b> and add your Magic ({character.magic}). 12 or more passes!"
          </p>
        </>
      )}

      {step === "result" && (
        <>
          <p><strong>Your total roll:</strong> {rollResult}</p>
          {success ? (
            <>
              <p style={{ color: "#1b5e20", fontWeight: "bold" }}>
                Success! The door unlocks and the class applauds.
              </p>
              <p>
                Professor Flitwick: "Brilliant work! {completed ? "" : "You've learned Alohomora and gained 10 experience."}"
              </p>
              <button
                style={{
                  background: theme.primary,
                  color: "#fff",
                  padding: "0.8rem 2rem",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  cursor: "pointer"
                }}
                onClick={() => navigate("/school")}
              >
                Return to School
              </button>
            </>
          ) : (
            <>
              <p style={{ color: "#b71c1c", fontWeight: "bold" }}>
                Failure! The door remains locked.
              </p>
              <p>
                Professor Flitwick: "Don't worry! With more study, you'll get it next time."
              </p>
              <button
                style={{
                  background: "#4287f5",
                  color: "#fff",
                  padding: "0.8rem 2rem",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  cursor: "pointer"
                }}
                onClick={() => navigate("/school")}
              >
                Return to School
              </button>
            </>
          )}
        </>
      )}

      {/* Floating spellbook button */}
      <button
        style={{
          position: "fixed",
          left: "2rem",
          bottom: "2rem",
          zIndex: 2000,
          width: "64px",
          height: "64px",
          border: "none",
          background: "none",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
        aria-label="Open Spellbook"
        onClick={() => setSpellbookOpen(true)}
        disabled={step !== "select"}
      >
        <svg
          width={64}
          height={64}
          viewBox="0 0 64 64"
          aria-hidden="true"
          style={{ display: "block" }}
        >
          <rect x="8" y="12" width="48" height="40" rx="6" fill="#e6ddb8" stroke="#865c2c" strokeWidth={3}/>
          <rect x="16" y="18" width="32" height="28" rx="2" fill="#fffbe9" />
          <path d="M32 18 v28" stroke="#c5ae86" strokeWidth={2}/>
          <text x="32" y="54" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#865c2c">Book</text>
        </svg>
        <span style={{
          fontSize: "0.95rem",
          color: "#865c2c",
          fontWeight: "bold",
          marginTop: "0.2em"
        }}>Spellbook</span>
      </button>
      {/* Spellbook Modal */}
      {spellbookOpen && (
        <div
          style={{
            position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.18)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center"
          }}
          onClick={() => setSpellbookOpen(false)}
        >
          <div
            style={{
              background: "#fffbe9",
              border: `2px solid ${theme.secondary}`,
              borderRadius: "16px",
              minWidth: 320,
              minHeight: 240,
              zIndex: 4000,
              padding: "2rem",
              boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ color: theme.secondary, marginTop: 0 }}>Standard Book of Spells Grade 1</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {GRADE1_SPELLS.map(spell => (
                <li key={spell}>
                  <button
                    style={{
                      background: spell === "Alohomora" ? "#b7e4c7" : "#ece6da",
                      color: "#222",
                      padding: "0.5em 1em",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      fontWeight: spell === "Alohomora" ? "bold" : "normal",
                      margin: "0.5em 0",
                      cursor: "pointer",
                      width: "100%",
                    }}
                    onClick={() => handleSpellClick(spell)}
                  >
                    {spell}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Floating dice button */}
      <button
        style={{
          position: "fixed",
          right: "2rem",
          bottom: "2rem",
          zIndex: 2000,
          width: "64px",
          height: "64px",
          border: "none",
          background: "none",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
        aria-label="Open Dice Roller"
        onClick={() => setDiceModalOpen(true)}
        disabled={step !== "roll"}
      >
        <span style={{
          fontSize: "2.2rem"
        }}>🎲</span>
        <span style={{
          fontSize: "0.95rem",
          color: "#865c2c",
          fontWeight: "bold",
          marginTop: "0.2em"
        }}>Roll Dice</span>
      </button>
      {diceModalOpen && (
        <div
          style={{
            position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.18)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center"
          }}
          onClick={() => setDiceModalOpen(false)}
        >
          <div
            style={{
              background: "#fffbe9",
              border: `2px solid ${theme.secondary}`,
              borderRadius: "16px",
              minWidth: 180,
              minHeight: 120,
              zIndex: 4000,
              padding: "2rem",
              boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
            onClick={e => e.stopPropagation()}
          >
            <DiceButton
              allowedDice={[12]}
              highlightDice={12}
              showModal={true}
              onRoll={handleDiceRoll}
              onClose={() => setDiceModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AlohomoraLesson;

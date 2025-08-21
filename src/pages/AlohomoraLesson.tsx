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
    setRollResult(result);
    const total = result + character.knowledge;
    const passed = total >= 12;
    setSuccess(passed);
    setDiceModalOpen(false);
    setStep("result");
    if (passed && !completed) {
      await markSpellLearnt();
    }
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
            Open your <b>{STANDARD_BOOK}</b> and select the unlocking charm!"
          </p>
          <div style={{ textAlign: "center", margin: "2em 0" }}>
            <button
              style={{
                background: "#4287f5",
                color: "#fff",
                padding: "0.7rem 2rem",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer"
              }}
              onClick={() => setSpellbookOpen(true)}
            >
              Open Spellbook
            </button>
          </div>
        </>
      )}

      {step === "select" && (
        <>
          <p>Select the spell for unlocking doors!</p>
          <div style={{ textAlign: "center", margin: "2em 0" }}>
            <button
              style={{
                background: "#4287f5",
                color: "#fff",
                padding: "0.7rem 2rem",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer"
              }}
              onClick={() => setSpellbookOpen(true)}
            >
              Open Spellbook
            </button>
          </div>
        </>
      )}

      {step === "wrong" && (
        <>
          <p style={{ color: "#b71c1c", fontWeight: "bold" }}>
            That's not the right spell for this lesson. Try again!
          </p>
          <div style={{ textAlign: "center", margin: "2em 0" }}>
            <button
              style={{
                background: "#4287f5",
                color: "#fff",
                padding: "0.7rem 2rem",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer"
              }}
              onClick={() => setStep("select")}
            >
              Open Spellbook
            </button>
          </div>
        </>
      )}

      {step === "roll" && (
        <>
          <p>
            Roll a <b>d12</b> and add your <b>Knowledge</b>.<br />
            You need a total of <b>12 or more</b> to succeed!
          </p>
          <div style={{ textAlign: "center", margin: "2em 0" }}>
            <DiceButton
              sides={12}
              onRoll={handleDiceRoll}
              disabled={diceModalOpen}
            />
          </div>
        </>
      )}

      {step === "result" && success !== null && (
        <div style={{ textAlign: "center", margin: "2em 0" }}>
          <div style={{ fontSize: "1.2em", marginBottom: 12 }}>
            You rolled <b>{rollResult}</b> + Knowledge <b>{character.knowledge}</b> = <b>{(rollResult || 0) + character.knowledge}</b>
          </div>
          {success ? (
            <>
              <div style={{ color: "#277827", fontWeight: "bold", marginBottom: 6 }}>
                Success! The door clicks open. Professor Flitwick beams.
              </div>
              <div style={{ marginBottom: 18 }}>
                You have learned <b>Alohomora</b>!<br />
                <span style={{ color: "#4287f5" }}>+10 experience</span>
              </div>
              <button
                style={{
                  background: "#277827",
                  color: "#fff",
                  padding: "0.7rem 2rem",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  cursor: "pointer"
                }}
                onClick={() => navigate("/school")}
              >
                Back to School
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
                onClick={() => setStep("roll")}
              >
                Try Again
              </button>
            </>
          )}
        </div>
      )}

      {spellbookOpen && (
        <SpellBook
          availableSpells={GRADE1_SPELLS}
          onSelect={handleSpellClick}
          onClose={() => setSpellbookOpen(false)}
          highlight="Alohomora"
        />
      )}
    </div>
  );
};

export default AlohomoraLesson;

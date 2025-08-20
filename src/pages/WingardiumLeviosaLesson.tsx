import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Character } from "../types";
import { houseThemes } from "../themes";
import DiceButton from "../components/DiceButton";
import SpellBook from "./Spellbook";
import { supabase } from "../supabaseClient";

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

type Step = "intro"|"select"|"feather"|"swish"|"resultFeather"|"cushionChoice"|"cushionMagic"|"cushionThrow"|"cushionResult"|"fail";

const WingardiumLeviosaLesson: React.FC<Props> = ({ character, setCharacter }) => {
  const theme = houseThemes[character.house];
  const navigate = useNavigate();
  const completed = (character.completedLessons ?? []).includes("Wingardium Leviosa");
  const [step, setStep] = useState<Step>("intro");
  const [spellbookOpen, setSpellbookOpen] = useState(false);
  const [diceModalOpen, setDiceModalOpen] = useState(false);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [hermione, setHermione] = useState(false);
  // For cushion part
  const [cushionMethod, setCushionMethod] = useState<"magic"|"throw"|null>(null);
  const [cushionSuccess, setCushionSuccess] = useState<boolean|null>(null);

  async function markSpellLearnt() {
    await supabase
      .from("character_spells")
      .upsert([
        { character_id: character.id, spell: "Wingardium Leviosa" }
      ], { onConflict: ["character_id", "spell"] });

    const newCompleted = Array.from(new Set([...(character.completedLessons ?? []), "Wingardium Leviosa"]));
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
    if (spell === "Wingardium Leviosa") {
      setSpellbookOpen(false);
      setStep("feather");
    } else {
      setSpellbookOpen(false);
      setStep("fail");
    }
  }

  // Feather float
  function handleFeatherRoll(result: number, sides: number) {
    if (sides !== 12) return;
    const total = result + character.magic;
    setRollResult(total);
    const passed = total >= 12;
    setSuccess(passed);
    setHermione(!passed);
    setDiceModalOpen(false);
    setStep("resultFeather");
  }

  // Cushion part
  async function handleCushionRoll(result: number, sides: number) {
    if (sides !== 12) return;
    const total = result + character.magic;
    setRollResult(total);
    const passed = total >= 15;
    setCushionSuccess(passed);
    if (passed && !completed) {
      await markSpellLearnt();
    }
    setDiceModalOpen(false);
    setStep("cushionResult");
  }

  function handleThrowCushion() {
    // 50% chance to succeed
    const passed = Math.random() < 0.5;
    setCushionMethod("throw");
    setCushionSuccess(passed);
    setStep("cushionResult");
  }

  function resetToSpell() {
    setStep("select");
    setHermione(false);
    setRollResult(null);
    setSuccess(null);
  }

  // UI
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
      <h3>Lesson: Wingardium Leviosa</h3>

      {step === "intro" && (
        <>
          <p>
            Professor Flitwick: "Today, we master <b>Wingardium Leviosa</b>! Open your <b>Standard Book of Spells Grade 1</b> and select the levitation charm!"
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
          Professor Flitwick: "Which spell will levitate your feather? Open your spellbook and select it!"
        </p>
      )}

      {step === "fail" && (
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
            onClick={resetToSpell}
          >
            Try again
          </button>
        </>
      )}

      {step === "feather" && (
        <>
          <p>
            Professor Flitwick: "Wands at the ready! Swish and flick, then roll a <b>d12</b> and add your Magic ({character.magic}). 12 or more to float the feather!"
          </p>
        </>
      )}

      {step === "resultFeather" && (
        <>
          <p><strong>Your total roll:</strong> {rollResult}</p>
          {success ? (
            <>
              <p style={{ color: "#1b5e20", fontWeight: "bold" }}>
                Success! The feather floats gracefully in the air.
              </p>
              <p>
                Professor Flitwick: "Splendid work! Now, let's try something harder. Can you move a cushion into the box?"
              </p>
              <div>
                <button
                  style={{
                    background: theme.primary,
                    color: "#fff",
                    padding: "0.8rem 2rem",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    margin: "0 1rem"
                  }}
                  onClick={() => { setCushionMethod("magic"); setStep("cushionMagic"); }}
                >
                  Use Magic
                </button>
                <button
                  style={{
                    background: theme.accent,
                    color: "#fff",
                    padding: "0.8rem 2rem",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    margin: "0 1rem"
                  }}
                  onClick={() => { setCushionMethod("throw"); handleThrowCushion(); }}
                >
                  Wait for Flitwick to look away and throw it
                </button>
              </div>
            </>
          ) : (
            <>
              <p style={{ color: "#b71c1c", fontWeight: "bold" }}>
                Failure! The feather doesn't budge.
              </p>
              {hermione && (
                <p>
                  Hermione whispers, <i>"You're saying it all wrong! It's <b>levi-OH-sa</b>, not <b>levio-SAR</b>!"</i>
                </p>
              )}
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
                onClick={resetToSpell}
              >
                Try again
              </button>
            </>
          )}
        </>
      )}

      {step === "cushionMagic" && (
        <>
          <p>
            Professor Flitwick: "Roll a <b>d12</b> and add your Magic ({character.magic}). 15 or more to move the cushion into the box!"
          </p>
        </>
      )}

      {step === "cushionResult" && (
        <>
          <p>
            <strong>{cushionMethod === "magic" ? "Your total roll:" : ""}</strong> {rollResult !== null ? rollResult : ""}
          </p>
          {cushionSuccess ? (
            <>
              <p style={{ color: "#1b5e20", fontWeight: "bold" }}>
                {cushionMethod === "magic"
                  ? "Success! The cushion floats perfectly into the box."
                  : "Success! When Flitwick isn't looking, you toss the cushion into the box. The class cheers, but you haven't actually learned the spell."
                }
              </p>
              <p>
                {cushionMethod === "magic"
                  ? <>
                      Professor Flitwick: "Excellent! You've mastered <i>Wingardium Leviosa</i>{completed ? "." : " and earned 10 experience."}"
                    </>
                  : <>
                      Professor Flitwick: <b>"Er... that was, um, unconventional. But the cushion's in!"</b>
                    </>
                }
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
                Failure! {cushionMethod === "magic"
                  ? "The cushion doesn't move."
                  : "Your throw is spotted and you get a stern look from Professor Flitwick."
                }
              </p>
              {cushionMethod === "magic" && (
                <p>
                  Hermione whispers, <i>"You're saying it all wrong! It's <b>levi-OH-sa</b>, not <b>levio-SAR</b>!"</i>
                </p>
              )}
              <button
                style={{
                  background: theme.secondary,
                  color: "#fff",
                  padding: "0.8rem 2rem",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  cursor: "pointer"
                }}
                onClick={() => {
                  if (cushionMethod === "magic") setStep("cushionMagic");
                  else setStep("cushionChoice");
                }}
              >
                Try Again
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
              boxShadow: "0 2px 12px rgba(0,0,0,0.10)"
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ color: theme.secondary, marginTop: 0 }}>Standard Book of Spells Grade 1</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {GRADE1_SPELLS.map(spell => (
                <li key={spell}>
                  <button
                    style={{
                      background: spell === "Wingardium Leviosa" ? "#ece6da" : "#ece6da",
                      color: "#222",
                      padding: "0.5em 1em",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      fontWeight: spell === "Wingardium Leviosa" ? "bold" : "normal",
                      margin: "0.5em 0",
                      cursor: "pointer",
                      width: "100%"
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
        disabled={
          !(
            (step === "feather" && !success) ||
            step === "cushionMagic"
          )
        }
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
              onRoll={step === "feather" ? handleFeatherRoll : handleCushionRoll}
              onClose={() => setDiceModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WingardiumLeviosaLesson;

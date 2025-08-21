import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Character } from "../types";

// IDs, constants
const GRADE1_SPELLS = [
  "Alohomora",
  "Lumos",
  "Wingardium Leviosa",
  "Incendio",
  "Nox",
];

const SPELLBOOK_NAME = "Standard Book of Spells Grade 1";

// The spell_id for Alohomora from your spells table (from screenshot)
const ALOHOMORA_SPELL_ID = "1b491583-19ab-4e24-bfe4-190c3a3257e8";

interface Props {
  character: Character;
  setCharacter: (c: Character) => void;
}

const DICE_SIDES = 12;
const PASS_THRESHOLD = 12; // 50/50 pass/fail for d12+magic

const AlohomoraLesson: React.FC<Props> = ({ character, setCharacter }) => {
  const navigate = useNavigate();
  const [spellbookOpen, setSpellbookOpen] = useState(false);
  const [diceOpen, setDiceOpen] = useState(false);
  const [step, setStep] = useState<"intro"|"spellbook"|"wrong"|"ready"|"rolling"|"result"|"success">("intro");
  const [selectedSpell, setSelectedSpell] = useState<string | null>(null);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [pass, setPass] = useState<boolean | null>(null);
  const [rolling, setRolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already learned guard (from local state only)
  const alreadyCompletedLesson = (character?.completedLessons ?? []).includes("Alohomora");

  // Debug logging helper
  function debugLog(msg: string, data?: any) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("[AlohomoraLesson]", msg, data);
    }
  }

  // Award XP & spell function
  async function awardSpellAndXP() {
    setError(null);

    // Check if already has the spell in DB
    let alreadyHasSpell = false;
    try {
      const { data: spellRows, error: fetchSpellError } = await supabase
        .from("character_spells")
        .select("id")
        .eq("character_id", character.id)
        .eq("spell_id", ALOHOMORA_SPELL_ID);
      if (fetchSpellError) {
        debugLog("Could not check for duplicate spell", fetchSpellError);
        // Don't stop execution, but warn
      }
      alreadyHasSpell = (spellRows?.length ?? 0) > 0;
    } catch (e) {
      debugLog("Error checking for existing spell", e);
    }

    if (alreadyHasSpell && alreadyCompletedLesson) {
      debugLog("Alohomora already awarded. Skipping DB update.");
      return;
    }

    try {
      if (!alreadyHasSpell) {
        debugLog("Awarding Alohomora spell...");
        const { error: spellError } = await supabase
          .from("character_spells")
          .insert([{ character_id: character.id, spell_id: ALOHOMORA_SPELL_ID }]);
        if (spellError) {
          debugLog("Spell insert error", spellError);
          setError("Could not unlock spell.");
          return;
        }
      } else {
        debugLog("Spell already present, not inserting.");
      }

      if (!alreadyCompletedLesson) {
        debugLog("Awarding experience and marking lesson complete...");
        const newExp = (character.experience ?? 0) + 10;
        const newCompleted = Array.from(new Set([...(character.completedLessons ?? []), "Alohomora"]));
        const { error: updateError } = await supabase
          .from("characters")
          .update({ completedLessons: newCompleted, experience: newExp })
          .eq("id", character.id);
        if (updateError) {
          debugLog("Character update error", updateError);
          setError("Could not award experience.");
          return;
        }
        setCharacter({
          ...character,
          completedLessons: newCompleted,
          experience: newExp,
        });
      } else {
        debugLog("Lesson already marked complete, not awarding experience.");
      }
    } catch (e) {
      debugLog("Exception in awardSpellAndXP", e);
      setError("Unexpected error. Try refreshing the page.");
    }
  }

  // UI components

  // Spellbook floating button, bottom left
  const SpellbookButton = (
    <button
      style={{
        position: "fixed",
        left: 16,
        bottom: 16,
        zIndex: 100,
        background: "#fffbe9",
        color: "#333",
        border: "2px solid #e3ce7d",
        borderRadius: "50%",
        width: 60,
        height: 60,
        fontWeight: "bold",
        fontSize: 13,
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.14)"
      }}
      onClick={() => {
        setSpellbookOpen(true);
        setStep("spellbook");
      }}
      aria-label="Open Spellbook"
    >
      📖<br />Spellbook
    </button>
  );

  // Dice floating button, bottom right
  const DiceButton = (
    <button
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 100,
        background: "#e3ce7d",
        color: "#333",
        border: "2px solid #b79b5a",
        borderRadius: "50%",
        width: 60,
        height: 60,
        fontWeight: "bold",
        fontSize: 18,
        cursor: rolling ? "not-allowed" : "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.14)",
        opacity: rolling ? 0.7 : 1
      }}
      disabled={rolling}
      onClick={() => {
        setDiceOpen(true);
        setStep("rolling");
        setRolling(true);
        setTimeout(() => {
          const roll = Math.ceil(Math.random() * DICE_SIDES);
          setRollResult(roll);
          const totalRoll = roll + (character.magic || 0);
          setTotal(totalRoll);
          const didPass = totalRoll >= PASS_THRESHOLD;
          setPass(didPass);
          setRolling(false);
          setStep("result");
          debugLog("Rolled dice", { roll, magic: character.magic, total: totalRoll, pass: didPass });
          // If pass, award spell/xp (but only once)
          if (didPass && !(alreadyCompletedLesson && alreadyHasSpell)) {
            awardSpellAndXP();
          }
        }, 900);
      }}
      aria-label="Roll d12"
    >
      🎲<br />d12
    </button>
  );

  // Spellbook Modal
  function SpellbookModal() {
    return (
      <div style={{
        position: "fixed",
        left: 0, top: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.24)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          background: "#fffbe9",
          border: "2px solid #e3ce7d",
          borderRadius: 14,
          padding: "2.2rem 2.5rem",
          minWidth: 320,
          minHeight: 220,
          boxShadow: "0 8px 32px rgba(0,0,0,0.11)",
          textAlign: "center"
        }}>
          <h3>{SPELLBOOK_NAME}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem", margin: "1.3rem 0" }}>
            {GRADE1_SPELLS.map((spell) => (
              <button
                key={spell}
                style={{
                  background: "#e3ce7d",
                  color: "#333",
                  border: "2px solid #b79b5a",
                  borderRadius: 8,
                  padding: "0.7em 1.3em",
                  fontWeight: "bold",
                  fontSize: "1.05rem",
                  margin: "0 0.3em",
                  cursor: "pointer"
                }}
                onClick={() => {
                  setSelectedSpell(spell);
                  if (spell === "Alohomora") {
                    setSpellbookOpen(false);
                    setStep("ready");
                  } else {
                    setSpellbookOpen(false);
                    setStep("wrong");
                  }
                }}
              >
                {spell}
              </button>
            ))}
          </div>
          <button
            style={{
              marginTop: 12,
              background: "#fff",
              border: "1px solid #b79b5a",
              borderRadius: 8,
              padding: "0.4em 1.1em",
              cursor: "pointer"
            }}
            onClick={() => {
              setSpellbookOpen(false);
              setStep("intro");
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 510,
        margin: "2.5rem auto",
        padding: "2.5rem",
        background: "#f9f7ed",
        borderRadius: 16,
        border: "2px solid #e3ce7d",
        color: "#222",
        position: "relative",
        fontFamily: "serif",
        minHeight: 430
      }}
    >
      <h2 style={{ fontFamily: "cursive", color: "#b79b5a", marginBottom: "0.5rem" }}>
        Professor Flitwick's Charms Class
      </h2>
      <h3>Lesson: Alohomora</h3>
      {error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}
      {alreadyCompletedLesson && (
        <div style={{ color: "#277827", marginBottom: 14 }}>
          You have already learned Alohomora. Practice makes perfect!
        </div>
      )}

      {/* Main lesson flow */}
      {step === "intro" && (
        <>
          <p>
            Professor Flitwick beams, "Welcome! Today you'll learn the unlocking charm.<br />
            Open your <b>{SPELLBOOK_NAME}</b> and pick the correct spell."
          </p>
        </>
      )}

      {step === "spellbook" && null /* handled in modal */}

      {step === "wrong" && (
        <>
          <p style={{ color: "#b71c1c", fontWeight: "bold" }}>
            That's not quite right. Try again!
          </p>
        </>
      )}

      {step === "ready" && (
        <>
          <p>
            Great choice! Now, let's see if you can cast it.<br />
            Click the dice in the bottom right, roll a <b>d12</b>, and add your <b>Magic</b> stat.<br />
            If your total is 12 or higher, you succeed!
          </p>
        </>
      )}

      {step === "rolling" && (
        <p>Rolling the dice...</p>
      )}

      {step === "result" && (
        <>
          <p>
            You rolled <b>{rollResult}</b> + Magic <b>{character.magic ?? 0}</b> = <b>{total}</b>
          </p>
          {pass ? (
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
                onClick={() => setStep("success")}
                disabled={rolling}
              >
                Finish Lesson
              </button>
            </>
          ) : (
            <>
              <div style={{ color: "#b71c1c", fontWeight: "bold", marginBottom: 6 }}>
                Failure! The door remains locked.
              </div>
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
                onClick={() => {
                  setStep("ready");
                  setPass(null);
                  setTotal(null);
                  setRollResult(null);
                }}
                disabled={rolling}
              >
                Try Again
              </button>
            </>
          )}
        </>
      )}

      {step === "success" && (
        <div style={{ textAlign: "center", margin: "2.5em 0" }}>
          <div style={{ color: "#277827", fontWeight: "bold", fontSize: "1.2em", marginBottom: 18 }}>
            Lesson Complete!
          </div>
          <div style={{ marginBottom: 16 }}>
            You've gained <b>10 experience</b> and unlocked <b>Alohomora</b>!
          </div>
          <button
            style={{
              background: "#7b2d26",
              color: "#fff",
              padding: "0.7rem 2.2rem",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              cursor: "pointer"
            }}
            onClick={() => navigate("/school")}
          >
            Back to School
          </button>
        </div>
      )}

      {/* Quit button always at bottom */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, textAlign: "center" }}>
        <button
          style={{
            background: "#e3ce7d",
            color: "#222",
            border: "1.5px solid #b79b5a",
            borderRadius: 8,
            padding: "0.5em 1.5em",
            fontWeight: "bold",
            fontSize: "1rem",
            marginTop: 16,
            cursor: "pointer"
          }}
          onClick={() => navigate("/school")}
        >
          Quit and Return to School
        </button>
      </div>

      {/* Spellbook modal */}
      {spellbookOpen && <SpellbookModal />}
      {/* Spellbook floating button, only if not open and not rolling dice */}
      {!spellbookOpen && !diceOpen && step !== "success" && SpellbookButton}
      {/* Dice floating button, only if ready to roll */}
      {!spellbookOpen && (step === "ready" || step === "result") && DiceButton}
    </div>
  );
};

export default AlohomoraLesson;

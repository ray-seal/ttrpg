import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const ALOHOMORA_SPELL = "Alohomora";

const AlohomoraLesson: React.FC<{ character: any; setCharacter: (c: any) => void }> = ({
  character,
  setCharacter,
}) => {
  const [step, setStep] = useState<"intro" | "roll" | "result" | "complete">("intro");
  const [success, setSuccess] = useState<boolean | null>(null);
  const [rolling, setRolling] = useState(false);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper for XP/spell upsert
  async function markSpellLearnt() {
    setError(null);
    try {
      // 1. Upsert spell
      await supabase.from("character_spells").upsert([
        { character_id: character.id, spell: ALOHOMORA_SPELL }
      ], { onConflict: ["character_id", "spell"] });

      // 2. Update completedLessons and experience
      const newCompleted = Array.from(
        new Set([...(character.completedLessons ?? []), ALOHOMORA_SPELL])
      );
      const newExp = (character.experience ?? 0) + 10;

      await supabase
        .from("characters")
        .update({
          completedLessons: newCompleted,
          experience: newExp,
        })
        .eq("id", character.id);

      // 3. Update local state (important for next renders!)
      setCharacter({
        ...character,
        completedLessons: newCompleted,
        experience: newExp,
      });
    } catch (e: any) {
      setError("Error awarding XP or unlocking spell.");
    }
  }

  function rollDice() {
    setRolling(true);
    setTimeout(() => {
      const roll = Math.ceil(Math.random() * 20);
      setRollResult(roll);
      const knowledge = character.knowledge || 0;
      if (roll + knowledge >= 12) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }
      setStep("result");
      setRolling(false);
    }, 800);
  }

  // Only allow completion if spell not already unlocked
  const alreadyCompleted = (character.completedLessons ?? []).includes(ALOHOMORA_SPELL);

  return (
    <div style={{
      maxWidth: 600,
      margin: "3rem auto",
      padding: "2.5rem",
      background: "#e3eafc",
      borderRadius: 14,
      fontFamily: "serif",
      color: "#19223b",
      border: "2px solid #4287f5"
    }}>
      <h2 style={{
        fontFamily: "cursive",
        textAlign: "center",
        marginBottom: "1.2rem",
        color: "#1e1c17"
      }}>
        Charms Class: Alohomora
      </h2>
      {error && <div style={{ color: "crimson", marginBottom: 16 }}>{error}</div>}
      {step === "intro" && (
        <>
          <p>
            Professor Flitwick twinkles at you. "Today we'll learn <b>Alohomora</b>, the unlocking charm! It's very handy for opening locked doors. Let's give it a try. Roll a d20 and add your <b>Knowledge</b>."
          </p>
          <div style={{ textAlign: "center", margin: "2em 0" }}>
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
              disabled={rolling}
            >
              Start Spell Attempt
            </button>
          </div>
        </>
      )}
      {step === "roll" && (
        <>
          <div style={{ textAlign: "center", margin: "2.5em 0" }}>
            <button
              style={{
                background: "#4287f5",
                color: "#fff",
                padding: "1rem 2.5rem",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "1.3rem",
                cursor: rolling ? "not-allowed" : "pointer",
                opacity: rolling ? 0.6 : 1,
              }}
              disabled={rolling}
              onClick={rollDice}
            >
              {rolling ? "Rolling..." : "Roll d20"}
            </button>
          </div>
        </>
      )}
      {step === "result" && success !== null && (
        <div style={{ textAlign: "center", margin: "2.5em 0" }}>
          <div style={{ fontSize: "1.2em", marginBottom: 12 }}>
            You rolled <b>{rollResult}</b> + Knowledge <b>{character.knowledge || 0}</b> = <b>{(rollResult || 0) + (character.knowledge || 0)}</b>
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
                onClick={async () => {
                  if (!alreadyCompleted) await markSpellLearnt();
                  setStep("complete");
                }}
              >
                Finish Lesson
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
      {step === "complete" && (
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
            onClick={() => window.location.href = "/school"}
          >
            Back to School
          </button>
        </div>
      )}
    </div>
  );
};

export default AlohomoraLesson;

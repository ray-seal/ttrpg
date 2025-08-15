import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Character } from "../types";
import { houseThemes } from "../themes";
import DiceButton from "../components/DiceButton";
import SpellBook from "./Spellbook";

const STANDARD_BOOK = "Standard Book of Spells Grade 1";
const WINGARDIUM = "Wingardium Leviosa";

interface Props {
  character: Character;
  setCharacter: (c: Character) => void;
}

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const WingardiumLeviosaLesson: React.FC<Props> = ({ character, setCharacter }) => {
  const theme = houseThemes[character.house];
  const navigate = useNavigate();
  const completed = (character.completedLessons ?? []).includes(WINGARDIUM);
  const [step, setStep] = useState<Step>(0); // 0=intro, 1=spellbook, 2=dice feather, 3=cushion choice, 4=dice cushion, 5=success, 6=fail
  const [diceModalOpen, setDiceModalOpen] = useState(false);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [method, setMethod] = useState<"magic" | "throw" | null>(null);
  const [throwSuccess, setThrowSuccess] = useState<boolean | null>(null);

  function handleSelectSpell(spell: string) {
    if (spell === WINGARDIUM) setStep(2);
  }

  // Feather float
  function handleFeatherRoll(result: number, sides: number) {
    if (sides !== 12) return;
    const total = result + character.magic;
    setRollResult(total);
    if (total >= 12) {
      setStep(3);
    } else {
      setStep(6);
    }
    setDiceModalOpen(false);
  }

  // Cushion part
  function handleCushionRoll(result: number, sides: number) {
    if (sides !== 12) return;
    const total = result + character.magic;
    setRollResult(total);
    if (total >= 15) {
      if (!completed) {
        setCharacter({
          ...character,
          unlockedSpells: Array.from(new Set([...(character.unlockedSpells ?? []), WINGARDIUM])),
          completedLessons: Array.from(new Set([...(character.completedLessons ?? []), WINGARDIUM])),
          experience: character.experience + 12,
        });
      }
      setStep(5);
    } else {
      setStep(6);
    }
    setDiceModalOpen(false);
  }

  // Throwing the cushion
  function handleThrowCushion() {
    // 50% chance to succeed
    const success = Math.random() < 0.5;
    setThrowSuccess(success);
    if (success) {
      setMethod("throw");
      setStep(5);
    } else {
      setStep(6);
    }
  }

  function tryAgain() {
    setRollResult(null);
    setStep(2);
  }

  function retryCushion() {
    setRollResult(null);
    setStep(4);
  }

  return (
    <div
      style={{
        background: theme.background,
        color: theme.primary,
        border: `2px solid ${theme.secondary}`,
        padding: "2rem",
        borderRadius: "16px",
        maxWidth: "540px",
        margin: "3rem auto",
        minHeight: "75vh",
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        fontFamily: "serif",
        textAlign: "center",
        position: "relative"
      }}
    >
      <h2>Professor Flitwick's Charms Class</h2>
      <h3 style={{ color: theme.secondary }}>Lesson: Wingardium Leviosa</h3>

      {step === 0 && (
        <>
          <p>
            Professor Flitwick grins, "Today, we master <b>Wingardium Leviosa</b>! You'll try to make a feather float. Remember: It's <b>levi-OH-sa</b>, not <b>levio-SAR</b>! Open your books and find the correct spell."
          </p>
          <button
            style={{
              background: theme.primary,
              color: "#fff",
              padding: "1rem 2rem",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              cursor: "pointer",
              marginTop: "1.5rem"
            }}
            onClick={() => setStep(1)}
          >
            Open Spellbook
          </button>
        </>
      )}

      {step === 1 && (
        <>
          <p>
            <b>Professor Flitwick:</b> "Select the spell to levitate the feather from your spellbook."
          </p>
          <div
            style={{
              position: "fixed",
              bottom: "2rem",
              left: "2rem",
              zIndex: 10,
              width: 350,
            }}
          >
            <SpellBook
              character={character}
              setCharacter={setCharacter}
              lessonBook={STANDARD_BOOK}
              highlightSpell={undefined}
              selectOnly
              onSelectSpell={handleSelectSpell}
            />
          </div>
          <p style={{ marginTop: "4em", color: theme.accent }}>
            (No spell is highlighted in this lesson)
          </p>
        </>
      )}

      {step === 2 && (
        <>
          <p>
            <b>Professor Flitwick:</b> "Let's see if you can float the feather.<br />
            Roll a <b>d12</b> and add your <b>Magic ({character.magic})</b>. You need 12 or more to succeed!"
          </p>
          <div
            style={{
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
              zIndex: 100
            }}
          >
            <DiceButton
              allowedDice={[12]}
              highlightDice={12}
              showModal={diceModalOpen}
              onRoll={handleFeatherRoll}
              onClose={() => setDiceModalOpen(false)}
            />
            <button
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "64px",
                height: "64px",
                background: "transparent",
                border: "none",
                zIndex: 1500,
                cursor: "pointer",
              }}
              aria-label="Open dice roller for lesson"
              onClick={() => setDiceModalOpen(true)}
              tabIndex={0}
            />
          </div>
          <p style={{ marginTop: "5em", color: theme.accent }}>
            (Only the d12 is available for this lesson)
          </p>
        </>
      )}

      {step === 3 && (
        <>
          <p>
            <strong>Your total roll:</strong> {rollResult}
          </p>
          <p style={{ color: "#1b5e20", fontWeight: "bold" }}>
            Success! The feather floats gracefully in the air.
          </p>
          <p>
            <b>Professor Flitwick:</b> "Splendid! Now, let's try something harder. Can you move a cushion into the box?"
          </p>
          <div style={{ margin: "2rem 0" }}>
            <button
              style={{
                background: theme.primary,
                color: "#fff",
                padding: "1rem 2rem",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "1.1rem",
                cursor: "pointer",
                margin: "0 1rem"
              }}
              onClick={() => {
                setMethod("magic");
                setStep(4);
              }}
            >
              Use Magic
            </button>
            <button
              style={{
                background: theme.accent,
                color: "#fff",
                padding: "1rem 2rem",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "1.1rem",
                cursor: "pointer",
                margin: "0 1rem"
              }}
              onClick={() => handleThrowCushion()}
            >
              Wait for Flitwick to look away and throw it
            </button>
          </div>
        </>
      )}

      {step === 4 && method === "magic" && (
        <>
          <p>
            <b>Professor Flitwick:</b> "Roll a <b>d12</b> and add your <b>Magic ({character.magic})</b>. You need 15 or more to move the cushion to the box!"
          </p>
          <div
            style={{
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
              zIndex: 100
            }}
          >
            <DiceButton
              allowedDice={[12]}
              highlightDice={12}
              showModal={diceModalOpen}
              onRoll={handleCushionRoll}
              onClose={() => setDiceModalOpen(false)}
            />
            <button
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "64px",
                height: "64px",
                background: "transparent",
                border: "none",
                zIndex: 1500,
                cursor: "pointer",
              }}
              aria-label="Open dice roller for lesson"
              onClick={() => setDiceModalOpen(true)}
              tabIndex={0}
            />
          </div>
          <p style={{ marginTop: "5em", color: theme.accent }}>
            (Only the d12 is available for this lesson)
          </p>
        </>
      )}

      {step === 5 && (
        <>
          {method === "throw" && throwSuccess ? (
            <>
              <p style={{ color: "#1b5e20", fontWeight: "bold" }}>
                Success! When Flitwick isn't looking, you toss the cushion into the box. The class cheers, but you haven't actually learned the spell.
              </p>
              <button
                style={{
                  background: theme.primary,
                  color: "#fff",
                  padding: "1rem 2rem",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  marginTop: "1.5rem"
                }}
                onClick={() => navigate("/school")}
              >
                Return to School
              </button>
            </>
          ) : (
            <>
              <p>
                <strong>Your total roll:</strong> {rollResult}
              </p>
              <p style={{ color: "#1b5e20", fontWeight: "bold" }}>
                Success! The cushion floats perfectly into the box.
              </p>
              <p>
                <b>Professor Flitwick:</b> "Excellent! You've mastered <i>Wingardium Leviosa</i>{completed ? "." : " and earned 12 experience."}"
              </p>
              <button
                style={{
                  background: theme.primary,
                  color: "#fff",
                  padding: "1rem 2rem",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  marginTop: "1.5rem"
                }}
                onClick={() => navigate("/school")}
              >
                Return to School
              </button>
            </>
          )}
        </>
      )}

      {step === 6 && (
        <>
          <p>
            <strong>{method === "magic" ? "Your total roll:" : ""}</strong> {rollResult !== null ? rollResult : ""}
          </p>
          <p style={{ color: "#b71c1c", fontWeight: "bold" }}>
            Failure! {method === "magic"
              ? "The feather/cushion doesn't budge."
              : "Your throw is spotted and you get a stern look from Professor Flitwick."}
          </p>
          <p>
            Hermione whispers, <i>"You're saying it all wrong! It's <b>levi-OH-sa</b>, not <b>levio-SAR</b>!"</i>
          </p>
          <button
            style={{
              background: theme.secondary,
              color: "#fff",
              padding: "1rem 2rem",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              cursor: "pointer",
              marginTop: "1.5rem"
            }}
            onClick={
              method === "magic"
                ? retryCushion
                : () => {
                    setMethod(null);
                    setStep(3);
                  }
            }
          >
            Try Again
          </button>
        </>
      )}
    </div>
  );
};

export default WingardiumLeviosaLesson;

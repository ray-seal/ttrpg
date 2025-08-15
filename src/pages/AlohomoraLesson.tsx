import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Character } from "../types";
import { houseThemes } from "../themes";
import DiceButton from "../components/DiceButton";
import SpellBook from "./Spellbook";

const STANDARD_BOOK = "Standard Book of Spells Grade 1";
const ALOHOMORA = "Alohomora";

interface Props {
  character: Character;
  setCharacter: (c: Character) => void;
}

const AlohomoraLesson: React.FC<Props> = ({ character, setCharacter }) => {
  const theme = houseThemes[character.house];
  const navigate = useNavigate();
  const completed = (character.completedLessons ?? []).includes("Alohomora");
  const [step, setStep] = useState(0); // 0=intro, 1=spellbook, 2=dice, 3=result
  const [diceModalOpen, setDiceModalOpen] = useState(false);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  function handleSelectSpell(spell: string) {
    if (spell === ALOHOMORA) setStep(2);
  }

  function handleDiceRoll(result: number, sides: number) {
    if (sides !== 12) return;
    const total = result + character.magic;
    setRollResult(total);
    const passed = total >= 12;
    setSuccess(passed);
    // Only grant XP/spell unlock on first clear
    if (passed && !completed) {
      setCharacter({
        ...character,
        unlockedSpells: Array.from(new Set([...(character.unlockedSpells ?? []), ALOHOMORA])),
        completedLessons: Array.from(new Set([...(character.completedLessons ?? []), "Alohomora"])),
        experience: character.experience + 10,
      });
    } else if (passed && completed) {
      setCharacter({
        ...character,
        unlockedSpells: Array.from(new Set([...(character.unlockedSpells ?? []), ALOHOMORA])),
      });
    }
    setStep(3);
    setDiceModalOpen(false);
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
      <h3 style={{ color: theme.secondary }}>Lesson: Alohomora</h3>

      {step === 0 && (
        <>
          <p>
            Professor Flitwick stands atop a stack of books, beaming at the class.<br />
            <b>
              "Welcome! Today you'll learn <i>Alohomora</i>, the unlocking charm. Open your books to <i>Standard Book of Spells, Grade 1</i> and find the correct spell."
            </b>
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
            <b>Professor Flitwick:</b> "Now, select the unlocking charm from your spellbook."
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
              highlightSpell={ALOHOMORA}
              selectOnly
              onSelectSpell={handleSelectSpell}
            />
          </div>
          <p style={{ marginTop: "4em", color: theme.accent }}>
            (Alohomora is highlighted for this lesson)
          </p>
        </>
      )}

      {step === 2 && (
        <>
          <p>
            <b>Professor Flitwick:</b> "Now, let's see if you can cast <i>Alohomora</i>.<br />
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
              onRoll={handleDiceRoll}
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
          {success ? (
            <>
              <p style={{ color: "#1b5e20", fontWeight: "bold" }}>
                Success! The door unlocks and the class applauds.
              </p>
              <p>
                <b>Professor Flitwick:</b> "Excellent work! {completed ? "" : "You have learned"} <i>Alohomora</i>{completed ? "" : " and gained 10 experience."}"
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
              <p style={{ color: "#b71c1c", fontWeight: "bold" }}>
                Failure! The door remains locked.
              </p>
              <p>
                <b>Professor Flitwick:</b> "Don't worry! With more study, you'll get it next time."
              </p>
              <button
                style={{
                  background: "#4287f5",
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
    </div>
  );
};

export default AlohomoraLesson;

import React { useState } from "react";
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

const WingardiumLeviosaLesson: React.FC<Props> = ({ character, setCharacter }) => {
  const theme = houseThemes[character.house];
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0=intro, 1=spellbook, 2=dice, 3=result(success), 4=fail
  const [selectedSpell, setSelectedSpell] = useState<string | null>(null);
  const [diceModalOpen, setDiceModalOpen] = useState(false);
  const [rollResult, setRollResult] = useState<number | null>(null);

  function handleSelectSpell(spell: string) {
    if (spell === WINGARDIUM) setStep(2);
  }

  function handleDiceRoll(result: number, sides: number) {
    if (sides !== 20) return;
    const total = result + character.magic;
    setRollResult(total);
    if (total >= 13) {
      setCharacter({
        ...character,
        unlockedSpells: Array.from(new Set([...(character.unlockedSpells ?? []), WINGARDIUM])),
        completedLessons: Array.from(new Set([...(character.completedLessons ?? []), WINGARDIUM])),
        experience: character.experience + 12,
      });
      setStep(3);
    } else {
      setStep(4);
    }
    setDiceModalOpen(false);
  }

  function tryAgain() {
    setRollResult(null);
    setStep(2);
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
            Professor Flitwick grins, "Today, we master <b>Wingardium Leviosa</b>! You'll try to make a feather float. Remember: It's <b>levi-OH-sa</b>, not <b>levio-SAR</b>!"
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
            Start Lesson
          </button>
        </>
      )}

      {step === 1 && (
        <>
          <p>
            <b>Professor Flitwick:</b> "Open your <i>Standard Book of Spells, Grade 1</i> and choose the correct spell to levitate the feather."
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
              highlightSpell={WINGARDIUM}
              selectOnly
              onSelectSpell={handleSelectSpell}
            />
          </div>
          <p style={{ marginTop: "4em", color: theme.accent }}>
            (Only <b>Wingardium Leviosa</b> can be selected for this lesson)
          </p>
        </>
      )}

      {step === 2 && (
        <>
          <p>
            <b>Professor Flitwick:</b> "Excellent! Now, let's see if you can float the feather.<br />
            Roll a <b>d20</b> and add your <b>Magic ({character.magic})</b>. You need 13 or more to succeed!"
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
              allowedDice={[20]}
              highlightDice={20}
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
            (Only the d20 is available for this lesson)
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
            <b>Professor Flitwick:</b> "Splendid! You've mastered <i>Wingardium Leviosa</i> and earned 12 experience."
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

      {step === 4 && (
        <>
          <p>
            <strong>Your total roll:</strong> {rollResult}
          </p>
          <p style={{ color: "#b71c1c", fontWeight: "bold" }}>
            Failure! The feather doesn't budge.
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
            onClick={tryAgain}
          >
            Try Again
          </button>
        </>
      )}
    </div>
  );
};

export default WingardiumLeviosaLesson;React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Character } from "../types";
import { houseThemes } from "../themes";

interface Props {
  character: Character;
  setCharacter: (c: Character) => void;
}

const WingardiumLeviosaLesson: React.FC<Props> = ({ character, setCharacter }) => {
  const theme = houseThemes[character.house];
  const [completed, setCompleted] = useState(
    (character.completedLessons || []).includes("Wingardium Leviosa")
  );
  const navigate = useNavigate();

  function handleComplete() {
    if (!completed) {
      setCompleted(true);
      setCharacter({
        ...character,
        completedLessons: [
          ...(character.completedLessons || []),
          "Wingardium Leviosa"
        ],
      });
    }
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
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        fontFamily: "serif",
        textAlign: "center",
      }}
    >
      <Link
        to="/school"
        style={{
          display: "inline-block",
          marginBottom: "1.2rem",
          background: theme.secondary,
          color: "#fff",
          padding: "0.7rem 1.3rem",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "1rem",
        }}
      >
        Back to School
      </Link>
      <h2>Wingardium Leviosa Lesson</h2>
      {!completed ? (
        <>
          <div style={{ margin: "2rem 0", fontSize: "1.15em" }}>
            <p>
              Welcome to your Levitation Charm lesson! Today, you'll learn <b>Wingardium Leviosa</b>.
            </p>
            <p>
              Practice the wand movement: <i>swish and flick</i>. Say the incantation clearly: <b>Wingardium Leviosa!</b>
            </p>
          </div>
          <button
            style={{
              background: theme.primary,
              color: "#fff",
              padding: "1rem 1.5rem",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              border: "none",
              cursor: "pointer",
              marginBottom: "1.5rem",
            }}
            onClick={handleComplete}
          >
            Complete Lesson
          </button>
        </>
      ) : (
        <>
          <div style={{ margin: "2rem 0", fontSize: "1.15em", color: theme.secondary }}>
            <p>
              Congratulations! You've learned <b>Wingardium Leviosa</b>. Objects can now fly at your command!
            </p>
          </div>
          <button
            style={{
              background: theme.primary,
              color: "#fff",
              padding: "1rem 1.5rem",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              border: "none",
              cursor: "pointer",
              marginBottom: "1.5rem",
            }}
            onClick={() => navigate("/school")}
          >
            Return to School
          </button>
        </>
      )}
    </div>
  );
};

export default WingardiumLeviosaLesson;

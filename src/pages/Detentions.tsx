import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Character } from "../types";
import { houseThemes } from "../themes";
import DiceButton from "../components/DiceButton";

interface Props {
  character: Character;
  setCharacter: (char: Character) => void;
}

type Step = "intro" | "knowledge1" | "magic" | "knowledge2" | "charisma" | "success" | "fail";

const checks = [
  { step: "knowledge1", label: "Knowledge check: Remember the correct potion residue cleaning technique.", stat: "knowledge", target: 10 },
  { step: "magic", label: "Magic check: Use magic to dissolve stubborn stains (but don't let Snape catch you!).", stat: "magic", target: 11 },
  { step: "knowledge2", label: "Knowledge check: Identify if all cauldrons are truly clean.", stat: "knowledge", target: 10 },
  { step: "charisma", label: "Charisma check: Try to talk Snape into letting you go early.", stat: "charisma", target: 12 },
];

const Detentions: React.FC<Props> = ({ character, setCharacter }) => {
  const [step, setStep] = useState<Step>("intro");
  const [showDiceModal, setShowDiceModal] = useState(false);
  const [currentCheck, setCurrentCheck] = useState(0);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const theme = houseThemes[character.house];
  const navigate = useNavigate();

  function handleStartCheck(idx: number) {
    setCurrentCheck(idx);
    setShowDiceModal(true);
  }

  function handleDiceRoll(result: number, sides: number) {
    setLastRoll(result);
    setShowDiceModal(false);

    const check = checks[currentCheck];
    const statValue = character[check.stat as keyof Character] || 0;
    const total = result + statValue;
    const passed = total >= check.target;

    if (passed) {
      if (currentCheck < checks.length - 1) {
        setStep(checks[currentCheck + 1].step as Step);
      } else {
        setStep("success");
      }
    } else {
      setStep("fail");
    }
  }

  function handleTryAgain() {
    setStep("intro");
    setCurrentCheck(0);
    setLastRoll(null);
  }

  function finishDetention() {
    setCharacter({
      ...character,
      flags: { ...character.flags, detention: false }
    });
    navigate("/school");
  }

  // Render steps
  if (step === "intro") {
    return (
      <div style={{ ...baseBox(theme) }}>
        <h2 style={{ color: theme.secondary }}>Detention Hall</h2>
        <p style={{ fontWeight: "bold" }}>Professor Slughorn greets you with a sneer.</p>
        <p>
          "Since you seem to think rules are optional, you'll be cleaning cauldrons by hand. Three cauldrons, spotless."
        </p>
        <button
          onClick={() => setStep("knowledge1")}
          style={mainBtn(theme)}
        >
          Begin Cleaning
        </button>
      </div>
    );
  }

  if (step === "fail") {
    return (
      <div style={{ ...baseBox(theme) }}>
        <h2 style={{ color: theme.secondary }}>Detention Failed</h2>
        <p style={{ color: "#b71c1c", fontWeight: "bold" }}>
          Slughorn inspects your work and finds it lacking. “Do it again {character.name}!” With a flick of his wand the caudrons fill with leftovers again!
        </p>
        <button onClick={handleTryAgain} style={mainBtn(theme)}>
          Try Again
        </button>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div style={{ ...baseBox(theme) }}>
        <h2 style={{ color: theme.secondary }}>Detention Complete</h2>
        <p style={{ color: "#388e3c", fontWeight: "bold" }}>
          You’ve impressed Slughorn. He grumbles, but waves you away. You are free from detention!
        </p>
        <button
          onClick={finishDetention}
          style={mainBtn(theme)}
        >
          Return to School
        </button>
      </div>
    );
  }

  // Otherwise, render the current check step
  const checkIdx = checks.findIndex(c => c.step === step);
  const check = checks[checkIdx];
  const statValue = character[check.stat as keyof Character] || 0;

  return (
    <div style={{ ...baseBox(theme) }}>
      <h2 style={{ color: theme.secondary }}>Detention Hall</h2>
      <p>
        <b>{check.label}</b>
        <br />
        (Roll d12 + {check.stat.charAt(0).toUpperCase() + check.stat.slice(1)}, target {check.target})
      </p>
      <button
        disabled={showDiceModal}
        onClick={() => handleStartCheck(checkIdx)}
        style={mainBtn(theme)}
      >
        Roll!
      </button>
      {typeof lastRoll === "number" && (
        <p>
          Last roll: <b>{lastRoll} + {statValue} = {lastRoll + statValue}</b>
        </p>
      )}
      {showDiceModal && (
        <div style={diceModalStyle}>
          <div style={diceModalInnerStyle(theme)}>
            <DiceButton
              allowedDice={[12]}
              highlightDice={12}
              showModal={true}
              onRoll={handleDiceRoll}
              onClose={() => setShowDiceModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// --- Styling helpers
function baseBox(theme: any) {
  return {
    background: theme.background,
    color: theme.primary,
    border: `2px solid ${theme.secondary}`,
    padding: "2rem",
    borderRadius: "16px",
    maxWidth: "540px",
    margin: "3rem auto",
    boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
    fontFamily: "serif",
    textAlign: "center"
  };
}
function mainBtn(theme: any) {
  return {
    background: theme.secondary,
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "0.7em 1.5em",
    fontWeight: "bold",
    fontSize: "1.07em",
    cursor: "pointer",
    marginTop: "1.3em"
  };
}
const diceModalStyle: React.CSSProperties = {
  position: "fixed",
  left: 0,
  top: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.18)",
  zIndex: 2000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};
const diceModalInnerStyle = (theme: any): React.CSSProperties => ({
  background: "#fffbe9",
  border: `2px solid ${theme.secondary}`,
  borderRadius: "16px",
  minWidth: 180,
  minHeight: 120,
  zIndex: 2100,
  padding: "2rem",
  boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
});

export default Detentions;

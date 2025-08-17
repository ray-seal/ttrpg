import React, { useState } from "react";
import { Character } from "../types";
import { houseThemes } from "../themes";

interface Props {
  character: Character;
  setCharacter: (char: Character) => void;
}

type Step = "intro" | "knowledge1" | "magic" | "knowledge2" | "charisma" | "success" | "fail";

const Detentions: React.FC<Props> = ({ character, setCharacter }) => {
  const [step, setStep] = useState<Step>("intro");
  const [results, setResults] = useState<{ [k: string]: boolean }>({});
  const [rolling, setRolling] = useState(false);
  const theme = houseThemes[character.house];

  function rollCheck(stat: number, target: number, label: string, next: Step) {
    setRolling(true);
    setTimeout(() => {
      const roll = Math.ceil(Math.random() * 12);
      const total = roll + stat;
      const success = total >= target;
      setResults(r => ({ ...r, [label]: success }));
      setRolling(false);
      setStep(success ? next : "fail");
    }, 750);
  }

  function finishDetention() {
    // Remove detention flag
    setCharacter({
      ...character,
      flags: { ...character.flags, detention: false }
    });
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
        textAlign: "center"
      }}
    >
      <h2 style={{ color: theme.secondary }}>Detention Hall</h2>
      {step === "intro" && (
        <div>
          <p style={{ fontWeight: "bold" }}>Professor Snape greets you with a sneer.</p>
          <p>
            "Since you seem to think rules are optional, you'll be cleaning cauldrons by hand. Three cauldrons, spotless. Then, if you can persuade me, you may go."
          </p>
          <button
            onClick={() => setStep("knowledge1")}
            style={{
              background: theme.primary,
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.7em 1.5em",
              fontWeight: "bold",
              fontSize: "1.07em",
              cursor: "pointer",
              marginTop: "1.3em"
            }}
          >
            Begin Cleaning
          </button>
        </div>
      )}
      {step === "knowledge1" && (
        <div>
          <p>
            <b>Knowledge check:</b> Remember the correct potion residue cleaning technique.<br />
            (Roll d12 + Knowledge, target 10)
          </p>
          <button
            disabled={rolling}
            onClick={() =>
              rollCheck(character.knowledge || 0, 10, "knowledge1", "magic")
            }
            style={{
              background: theme.accent,
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.7em 1.5em",
              fontWeight: "bold",
              fontSize: "1.07em",
              cursor: "pointer",
              marginTop: "1.3em"
            }}
          >
            Roll!
          </button>
          {rolling && <p>Rolling...</p>}
        </div>
      )}
      {step === "magic" && (
        <div>
          <p>
            <b>Magic check:</b> Use magic to dissolve stubborn stains (but don't let Snape catch you!).<br />
            (Roll d12 + Magic, target 11)
          </p>
          <button
            disabled={rolling}
            onClick={() =>
              rollCheck(character.magic || 0, 11, "magic", "knowledge2")
            }
            style={{
              background: theme.accent,
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.7em 1.5em",
              fontWeight: "bold",
              fontSize: "1.07em",
              cursor: "pointer",
              marginTop: "1.3em"
            }}
          >
            Roll!
          </button>
          {rolling && <p>Rolling...</p>}
        </div>
      )}
      {step === "knowledge2" && (
        <div>
          <p>
            <b>Knowledge check:</b> Identify if all cauldrons are truly clean.<br />
            (Roll d12 + Knowledge, target 10)
          </p>
          <button
            disabled={rolling}
            onClick={() =>
              rollCheck(character.knowledge || 0, 10, "knowledge2", "charisma")
            }
            style={{
              background: theme.accent,
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.7em 1.5em",
              fontWeight: "bold",
              fontSize: "1.07em",
              cursor: "pointer",
              marginTop: "1.3em"
            }}
          >
            Roll!
          </button>
          {rolling && <p>Rolling...</p>}
        </div>
      )}
      {step === "charisma" && (
        <div>
          <p>
            <b>Charisma check:</b> Try to talk Snape into letting you go early.<br />
            (Roll d12 + Charisma, target 12)
          </p>
          <button
            disabled={rolling}
            onClick={() =>
              rollCheck(character.charisma || 0, 12, "charisma", "success")
            }
            style={{
              background: theme.accent,
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.7em 1.5em",
              fontWeight: "bold",
              fontSize: "1.07em",
              cursor: "pointer",
              marginTop: "1.3em"
            }}
          >
            Roll!
          </button>
          {rolling && <p>Rolling...</p>}
        </div>
      )}
      {step === "success" && (
        <div>
          <p style={{ color: "#388e3c", fontWeight: "bold" }}>
            You’ve impressed Snape (somehow). He grumbles, but waves you away. You are free from detention!
          </p>
          <button
            onClick={finishDetention}
            style={{
              background: theme.secondary,
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.7em 1.5em",
              fontWeight: "bold",
              fontSize: "1.07em",
              cursor: "pointer",
              marginTop: "1.3em"
            }}
          >
            Return to School
          </button>
        </div>
      )}
      {step === "fail" && (
        <div>
          <p style={{ color: "#b71c1c", fontWeight: "bold" }}>
            Snape inspects your work and finds it lacking. “You’ll be staying late, I’m afraid.” Try again!
          </p>
          <button
            onClick={() => setStep("intro")}
            style={{
              background: theme.secondary,
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.7em 1.5em",
              fontWeight: "bold",
              fontSize: "1.07em",
              cursor: "pointer",
              marginTop: "1.3em"
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Detentions;

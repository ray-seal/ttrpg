import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import campaignData from "../campaigns/year1-main.json";
import { Character } from "../types";
import { houseThemes } from "../themes";
import DiceButton from "../components/DiceButton";

interface CampaignPageProps {
  character: Character;
  setCharacter: (char: Character) => void;
}

type Scene = {
  id: string;
  text: string;
  choices: {
    text: string;
    next: string;
    setFlag?: string;
    action?: string;
    requiredSpell?: string;
    awardExperience?: number;
    roll?: {
      stat: string;
      target: number;
      success: string;
      fail: string;
    }
  }[];
  setFlag?: string;
};

function interpolate(text: string, character: Character) {
  if (!text) return "";
  return text
    .replace(/\{character\.house\}/g, character.house || "")
    .replace(/\{character\.name\}/g, character.name || "");
}

const getProgressKey = (character: Character) =>
  `campaignProgress_${character.id ?? character.name ?? "default"}`;

const getFlagsKey = (character: Character) =>
  `campaignFlags_${character.id ?? character.name ?? "default"}`;

// Helper for loading flags object from localStorage
function loadFlags(key: string): Record<string, boolean> {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : {};
}

const CampaignPage: React.FC<CampaignPageProps> = ({ character, setCharacter }) => {
  const navigate = useNavigate();
  const theme = houseThemes[character.house];
  const hasDetention = !!(character.flags && character.flags.detention);

  // Progress and flags keys
  const progressKey = getProgressKey(character);
  const flagsKey = getFlagsKey(character);

  // Scene progress
  const savedSceneId = localStorage.getItem(progressKey) || "wakeup";
  const [sceneId, setSceneId] = useState(savedSceneId);

  // Campaign flags (e.g. metPeeves, ateBreakfast, etc)
  const [flags, setFlags] = useState<Record<string, boolean>>(loadFlags(flagsKey));

  // Dice modal state
  const [pendingRoll, setPendingRoll] = useState<null | {
    roll: {
      stat: string;
      target: number;
      success: string;
      fail: string;
    };
    choice: any;
  }>(null);

  // Save progress and flags to localStorage
  useEffect(() => {
    localStorage.setItem(progressKey, sceneId);
  }, [sceneId, progressKey]);

  useEffect(() => {
    localStorage.setItem(flagsKey, JSON.stringify(flags));
  }, [flags, flagsKey]);

  // Reset campaign progress/flags if character resets
  useEffect(() => {
    if (!character) {
      localStorage.removeItem(progressKey);
      localStorage.removeItem(flagsKey);
    }
  }, [character, progressKey, flagsKey]);

  // ---- SYNC CAMPAIGN FLAGS TO CHARACTER FLAGS ----
  useEffect(() => {
    if (character && flags) {
      setCharacter({
        ...character,
        flags: {
          ...(character.flags || {}),
          ...flags,
        }
      });
    }
    // eslint-disable-next-line
  }, [flags]);
  // ------------------------------------------------

  const scene = (campaignData.scenes as Scene[]).find((s) => s.id === sceneId);

  // Helper for checking if a choice should be shown
  function choiceIsAvailable(choice: any) {
    // Required spell check
    if (choice.requiredSpell) {
      // Check both character.unlockedSpells (array) and character.flags for spell unlock
      if (
        !(
          (character.unlockedSpells && character.unlockedSpells.includes(choice.requiredSpell)) ||
          (character.flags && character.flags[choice.requiredSpell])
        )
      ) {
        return false;
      }
    }
    // You can add flag or stat requirements here later
    return true;
  }

  if (hasDetention) {
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
          position: "relative",
        }}
      >
        <h2 style={{ color: theme.secondary }}>Campaign Locked</h2>
        <p>
          You cannot participate in the campaign while you have an outstanding detention.<br />
          Please report to detention to complete your punishment.
        </p>
        <button
          onClick={() => navigate("/detentions")}
          style={{
            background: theme.secondary,
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "0.8em 1.8em",
            fontWeight: "bold",
            fontSize: "1.1em",
            cursor: "pointer",
            marginTop: "1em"
          }}
        >
          Go To Detention
        </button>
      </div>
    );
  }

  function handleChoice(choice: any) {
    // Set campaign state/flags
    if (scene?.setFlag) {
      setFlags(prev => ({ ...prev, [scene.setFlag]: true }));
      // If this flag is also a character property, update that:
      if (scene.setFlag === "hasTimetable" && !character.hasTimetable) {
        setCharacter({ ...character, hasTimetable: true });
      }
    }
    if (choice.setFlag) {
      setFlags(prev => ({ ...prev, [choice.setFlag]: true }));
    }

    // Unlock Peeves Pests membership for the character
    if (choice.action === "unlockPeevesPests") {
      setCharacter({ ...character, unlockedPeevesPests: true });
    }

    if (choice.action === "unlockSchool" && !character.hasTimetable) {
      setCharacter({ ...character, hasTimetable: true });
    }

    // Award experience points (house points) if present
    if (typeof choice.awardExperience === "number") {
      setCharacter({
        ...character,
        experience: (character.experience || 0) + choice.awardExperience
      });
    }

    // If this is the "Go to school page" choice, navigate!
    if (choice.action === "gotoSchool") {
      navigate("/school");
      return;
    }
    if (choice.action === "restartCampaign") {
      // Clear progress and flags, restart at beginning
      setSceneId("wakeup");
      setFlags({});
      localStorage.setItem(progressKey, "wakeup");
      localStorage.setItem(flagsKey, "{}");
      return;
    }
    if (choice.action === "goHome") {
      navigate("/");
      return;
    }
    if (choice.next === "END") {
      setSceneId("END");
      return;
    }

    if (choice.roll) {
      setPendingRoll({ roll: choice.roll, choice });
      return;
    }

    setSceneId(choice.next);
  }

  function handleDiceRoll(result: number, sides: number) {
    if (!pendingRoll) return;
    const { roll } = pendingRoll;
    const statValue = character[roll.stat] || 0;
    const total = result + statValue;
    setPendingRoll(null);
    setTimeout(() => {
      setSceneId(total >= roll.target ? roll.success : roll.fail);
    }, 800);
  }

  if (sceneId === "END") {
    return (
      <div style={{
        maxWidth: 540,
        margin: "2rem auto",
        background: "#fffbe9",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.14)",
        textAlign: "center"
      }}>
        <h2 style={{ marginBottom: "1.2em" }}>More Campaign Coming Soon</h2>
        <div style={{
          background: "#ece6da",
          borderRadius: "8px",
          padding: "1em",
          color: "#7b2d26",
          fontWeight: "bold",
          fontSize: "1.13em"
        }}>
          Check back later for new adventures!
        </div>
        <button
          style={{
            marginTop: "2em",
            padding: "0.7em 1.6em",
            borderRadius: "8px",
            background: "#d3c56b",
            color: "#333",
            border: "none",
            fontWeight: "bold",
            fontSize: "1.08em",
            cursor: "pointer"
          }}
          onClick={() => navigate("/")}
        >
          Return to Home
        </button>
        <button
          style={{
            marginTop: "1em",
            padding: "0.7em 1.6em",
            borderRadius: "8px",
            background: "#b7e4c7",
            color: "#333",
            border: "none",
            fontWeight: "bold",
            fontSize: "1.08em",
            cursor: "pointer"
          }}
          onClick={() => handleChoice({ action: "restartCampaign" })}
        >
          Restart Campaign
        </button>
      </div>
    );
  }

  if (!scene) return <div>Scene not found.</div>;

  return (
    <div style={{
      maxWidth: 540,
      margin: "2rem auto",
      background: "#fffbe9",
      padding: "2rem",
      borderRadius: "12px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.14)"
    }}>
      <p style={{ fontSize: "1.16rem" }}>{interpolate(scene.text, character)}</p>
      <div>
        {scene.choices
          .filter(choiceIsAvailable)
          .map((choice, i) =>
            choice.roll ? (
              <button
                key={i}
                style={{
                  display: "block",
                  margin: "1em 0",
                  padding: "0.8em 1.5em",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1.06rem",
                  background: "#d3c56b",
                  color: "#333",
                  border: "none",
                  cursor: "pointer"
                }}
                onClick={() => handleChoice(choice)}
              >
                {choice.text}
              </button>
            ) : (
              <button
                key={i}
                style={{
                  display: "block",
                  margin: "1em 0",
                  padding: "0.8em 1.5em",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1.06rem",
                  background: "#d3c56b",
                  color: "#333",
                  border: "none",
                  cursor: "pointer"
                }}
                onClick={() => handleChoice(choice)}
              >
                {choice.text}
              </button>
            )
          )}

        <button
          style={{
            marginTop: "2em",
            padding: "0.7em 1.6em",
            borderRadius: "8px",
            background: "#b7e4c7",
            color: "#333",
            border: "none",
            fontWeight: "bold",
            fontSize: "1.08em",
            cursor: "pointer"
          }}
          onClick={() => navigate("/")}
        >
          Back To Home
        </button>
      </div>
      {pendingRoll && (
        <DiceButton
          allowedDice={[12]}
          showModal={true}
          onRoll={handleDiceRoll}
          onClose={() => setPendingRoll(null)}
        />
      )}
    </div>
  );
};

export default CampaignPage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import campaignData from "../campaigns/year1-main.json";
import { Character } from "../types";

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
  }[];
  setFlag?: string;
};

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

  // Progress and flags keys
  const progressKey = getProgressKey(character);
  const flagsKey = getFlagsKey(character);

  // Scene progress
  const savedSceneId = localStorage.getItem(progressKey) || "wakeup";
  const [sceneId, setSceneId] = useState(savedSceneId);

  // Campaign flags (e.g. metPeeves, ateBreakfast, etc)
  const [flags, setFlags] = useState<Record<string, boolean>>(loadFlags(flagsKey));

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

  const scene = (campaignData.scenes as Scene[]).find((s) => s.id === sceneId);

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
    if (choice.action === "unlockSchool" && !character.hasTimetable) {
      setCharacter({ ...character, hasTimetable: true });
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
    setSceneId(choice.next);
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
      <p style={{ fontSize: "1.16rem" }}>{scene.text}</p>
      <div>
        {scene.choices.map((choice, i) => (
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
        ))}
        {/* Always show a back to home button */}
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
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default CampaignPage;

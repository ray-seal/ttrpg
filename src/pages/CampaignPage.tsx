import React, { useState } from "react";
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

const CampaignPage: React.FC<CampaignPageProps> = ({ character, setCharacter }) => {
  const [sceneId, setSceneId] = useState("wakeup");

  // Helper: get current scene
  const scene = (campaignData.scenes as Scene[]).find((s) => s.id === sceneId);

  // Set flag in character state if needed
  function handleChoice(choice: any) {
    // Set a campaign flag on the character (e.g., hasTimetable)
    if (scene?.setFlag) {
      if (scene.setFlag === "hasTimetable" && !character.hasTimetable) {
        setCharacter({ ...character, hasTimetable: true });
      }
      // Add other flag logic here if you want
    }
    if (choice.action === "unlockSchool" && !character.hasTimetable) {
      setCharacter({ ...character, hasTimetable: true });
    }
    if (choice.next === "END") {
      // Optionally: route away, or just end campaign here
      return;
    }
    setSceneId(choice.next);
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
      </div>
    </div>
  );
};

export default CampaignPage;

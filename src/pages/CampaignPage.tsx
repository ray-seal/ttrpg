import React, { useState } from "react";
import campaignData from "../campaigns/year1-main.json";

// Example: you might want to manage this in context or global state
function CampaignPage({ unlockSchool }: { unlockSchool: () => void }) {
  const [sceneId, setSceneId] = useState("wakeup");
  const [flags, setFlags] = useState<{ [flag: string]: boolean }>({});

  const scene = campaignData.scenes.find(s => s.id === sceneId);

  function handleChoice(choice: any) {
    // Set any flags
    if (scene?.setFlag) {
      setFlags(prev => ({ ...prev, [scene.setFlag]: true }));
    }
    if (choice.action === "unlockSchool") {
      unlockSchool();
    }
    if (choice.next === "END") return;
    setSceneId(choice.next);
  }

  if (!scene) return <div>Scene not found.</div>;

  return (
    <div style={{ maxWidth: 480, margin: "2rem auto", background: "#fffbe9", padding: "2rem", borderRadius: "12px" }}>
      <p>{scene.text}</p>
      <div>
        {scene.choices.map((choice: any, i: number) => (
          <button
            key={i}
            style={{ display: "block", margin: "1em 0", padding: "0.8em 1.5em", borderRadius: "8px", fontWeight: "bold" }}
            onClick={() => handleChoice(choice)}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CampaignPage;

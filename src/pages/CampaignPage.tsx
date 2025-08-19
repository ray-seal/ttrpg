import React, { useState } from "react";
import scenes from "../campaigns/year1-main.json";
import { Character } from "../types";
import DiceButton from "../components/DiceButton";
import ItemModal from "../components/ItemModal";

interface CampaignPageProps {
  character: Character;
  setCharacter: (char: Character) => void;
}

const CampaignPage: React.FC<CampaignPageProps> = ({ character, setCharacter }) => {
  const [currentSceneId, setCurrentSceneId] = useState(character.currentSceneId || "wakeup");
  const [rolling, setRolling] = useState<any>(null);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [showDice, setShowDice] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);

  const scene = scenes.scenes.find(s => s.id === currentSceneId);

  function handleChoice(choice: any) {
    let updatedCharacter = { ...character };

    if (choice.setFlag) {
      updatedCharacter.flags = { ...updatedCharacter.flags, [choice.setFlag]: true };
    }
    if (choice.awardExperience) {
      updatedCharacter.experience = (updatedCharacter.experience || 0) + choice.awardExperience;
    }
    if (choice.awardItem) {
      updatedCharacter.items = Array.from(new Set([...(updatedCharacter.items || []), choice.awardItem]));
    }
    if (choice.action === "gotoSchool") updatedCharacter.currentSceneId = undefined;

    // End of content lock: if scene is "end_of_content", do not advance
    if (choice.next === "end_of_content") {
      setCurrentSceneId("end_of_content");
      updatedCharacter.currentSceneId = "end_of_content";
    } else if (choice.next === "END") {
      // Lock campaign at end scene (do not restart)
      setCurrentSceneId("end_of_content");
      updatedCharacter.currentSceneId = "end_of_content";
    } else {
      setCurrentSceneId(choice.next);
      updatedCharacter.currentSceneId = choice.next;
    }
    setCharacter(updatedCharacter);
    setRollResult(null);
    setShowDice(false);
  }

  function handleRollChoice(choice: any) {
    setRolling(choice.roll);
    setShowDice(true);
  }

  function handleRollResult(diceValue: number) {
    if (typeof rolling === "object" && rolling !== null) {
      const statValue = Number(character[rolling.stat]) || 0;
      const total = diceValue + statValue;
      setRollResult(total);
      setShowDice(false);
      setTimeout(() => {
        handleChoice({ next: total >= rolling.target ? rolling.success : rolling.fail });
        setRolling(null);
      }, 1200);
    }
  }

  const filteredChoices = (scene?.choices || []).filter(choice => {
    if (choice.requiredSpell && !character.unlockedSpells?.includes(choice.requiredSpell)) {
      return false;
    }
    if (choice.requiredEquippedSpell && !character.equippedSpells?.includes(choice.requiredEquippedSpell)) {
      return false;
    }
    if (choice.requiredItem && !character.items?.includes(choice.requiredItem)) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ maxWidth: 660, margin: "2rem auto", background: "#fffbe9", borderRadius: 16, padding: "1.5rem 1.5rem 5rem 1.5rem", minHeight: 360, position: "relative" }}>
      <h2 style={{ margin: 0, fontFamily: "serif" }}>Hogwarts Adventure</h2>
      <div style={{ margin: "1.2rem 0", fontSize: "1.18em", minHeight: 120 }}>
        {scene?.text || "Scene not found."}
      </div>
      <div>
        {filteredChoices.length === 0 && (
          // Show end message if no choices and in end scene
          currentSceneId === "end_of_content" ? (
            <div style={{ marginTop: "2em", fontWeight: "bold", color: "#b71c1c", fontSize: "1.25em" }}>
              Adventure complete! More coming soon.
            </div>
          ) : null
        )}
        {filteredChoices.map((choice, idx) => {
          if (choice.roll) {
            return (
              <button
                key={idx}
                style={{ margin: "0.7em 0", padding: "0.7em 1.8em", background: "#b7e4c7", borderRadius: 10, border: "none", fontWeight: "bold", fontSize: "1.07em", cursor: "pointer" }}
                onClick={() => handleRollChoice(choice)}
                disabled={showDice}
              >
                {choice.text}
              </button>
            );
          }
          return (
            <button
              key={idx}
              style={{ margin: "0.7em 0", padding: "0.7em 1.8em", background: "#b7e4c7", borderRadius: 10, border: "none", fontWeight: "bold", fontSize: "1.07em", cursor: "pointer" }}
              onClick={() => handleChoice(choice)}
              disabled={showDice}
            >
              {choice.text}
            </button>
          );
        })}
      </div>
      {showDice && (
        <DiceButton
          allowedDice={[12]}
          showModal={true}
          onRoll={handleRollResult}
          onClose={() => setShowDice(false)}
        />
      )}
      {rollResult !== null && (
        <div style={{ margin: "1em 0", fontWeight: "bold", color: "#2a7b3e", fontSize: "1.2em" }}>
          Roll result: {rollResult}
        </div>
      )}

      {/* Spellbook (bottom left) */}
      <a
        href="/spellbook"
        style={{
          position: "fixed",
          left: 24,
          bottom: 24,
          zIndex: 1200,
          background: "#fff",
          border: "2px solid #d3c56b",
          borderRadius: "50%",
          width: 60,
          height: 60,
          fontWeight: "bold",
          fontSize: "1.5em",
          boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          color: "#333"
        }}
        aria-label="Open spellbook"
      >
        📖
      </a>

      {/* Items Modal Button (above spellbook) */}
      <button
        style={{
          position: "fixed",
          left: 24,
          bottom: 94,
          zIndex: 1200,
          background: "#fff",
          border: "2px solid #d3c56b",
          borderRadius: "50%",
          width: 60,
          height: 60,
          fontWeight: "bold",
          fontSize: "1.5em",
          boxShadow: "0 2px 10px rgba(0,0,0,0.10)"
        }}
        onClick={() => setShowItemModal(true)}
        aria-label="Open items"
      >
        🎁
      </button>
      {showItemModal && (
        <ItemModal
          items={character.items || []}
          onUseItem={item => {
            setShowItemModal(false);
          }}
          onClose={() => setShowItemModal(false)}
        />
      )}

      {/* Dice button (bottom right) */}
      <button
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 1200,
          background: "#fff",
          border: "2px solid #d3c56b",
          borderRadius: "50%",
          width: 60,
          height: 60,
          fontWeight: "bold",
          fontSize: "1.5em",
          boxShadow: "0 2px 10px rgba(0,0,0,0.10)"
        }}
        onClick={() => setShowDice(true)}
        aria-label="Roll dice"
      >
        🎲
      </button>
    </div>
  );
};

export default CampaignPage;

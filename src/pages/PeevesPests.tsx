import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Character } from "../types";
import { houseThemes } from "../themes";

// Peeves Pests quests data
const quests = [
  {
    id: "worthy",
    title: "Prove You're Worthy",
    description: (
      <>
        Float a jug of water over the staff table and tip it on Professor Snape using <b>Wingardium Leviosa</b>.<br />
        <span style={{ fontStyle: 'italic' }}>Are you bold enough to pull it off?</span>
      </>
    ),
    requiredSpell: "Wingardium Leviosa", // Only appears after this spell is unlocked
    completedFlag: "peevesWorthyQuestDone",
    rewardXP: 25
  },
  // You can add more quests here, using requiredSpell or requiredFlag as needed
];

interface Props {
  character: Character;
  setCharacter?: (char: Character) => void;
}

const getHouseKey = (house: string) => {
  // Use lowercased house name for character fields; adjust as needed for your data shape
  return house.toLowerCase();
};

const PeevesPests: React.FC<Props> = ({ character, setCharacter }) => {
  const theme = houseThemes[character.house];
  const flags = character.flags || {};
  const unlockedSpells = character.unlockedSpells || [];
  const [activeQuest, setActiveQuest] = useState<string | null>(null);
  const [questStep, setQuestStep] = useState<"intro" | "rolling" | "result" | null>(null);
  const [roll, setRoll] = useState<number | null>(null);
  const [questResult, setQuestResult] = useState<"success" | "fail" | null>(null);

  // Quests are visible if the requiredSpell is unlocked, requiredFlag (if any) is set, and completedFlag is not set
  const visibleQuests = quests.filter(q => {
    if (q.requiredSpell && !unlockedSpells.includes(q.requiredSpell)) return false;
    if (q.requiredFlag && !flags[q.requiredFlag]) return false;
    if (q.completedFlag && flags[q.completedFlag]) return false;
    return true;
  });

  function startQuest(qid: string) {
    setActiveQuest(qid);
    setQuestStep("intro");
    setRoll(null);
    setQuestResult(null);
  }

  function rollForAgility() {
    const d12 = Math.ceil(Math.random() * 12);
    const total = d12 + (character.agility || 0);
    setRoll(total);
    setQuestStep("result");
    if (total >= 13) {
      setQuestResult("success");
      // Complete quest, give XP
      if (setCharacter) {
        setCharacter({
          ...character,
          experience: (character.experience || 0) + 25,
          flags: { ...flags, peevesWorthyQuestDone: true }
        });
      }
    } else {
      setQuestResult("fail");
      // Complete quest, give detention and subtract house points
      if (setCharacter) {
        const houseKey = getHouseKey(character.house);
        // Subtract 10 from the correct house, clamp at 0
        const newPoints = Math.max(0, (character[houseKey] || 0) - 10);
        setCharacter({
          ...character,
          [houseKey]: newPoints,
          flags: { ...flags, peevesWorthyQuestDone: true, detention: true }
        });
      }
    }
  }

  function closeQuestModal() {
    setActiveQuest(null);
    setQuestStep(null);
    setRoll(null);
    setQuestResult(null);
  }

  // Modal/dialogue for the "worthy" quest
  const worthyQuestModal = (
    <div
      style={{
        position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
        zIndex: 4000, background: "rgba(0,0,0,0.18)",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}
      onClick={closeQuestModal}
    >
      <div
        style={{
          background: "#fffbe9",
          border: `3px solid ${theme.secondary}`,
          borderRadius: "16px",
          minWidth: 300,
          maxWidth: 420,
          padding: "2rem",
          boxShadow: "0 2px 12px rgba(0,0,0,0.14)",
          fontFamily: "serif",
          position: "relative"
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Dialogue steps */}
        {questStep === "intro" && (
          <>
            <div style={{ fontWeight: "bold", color: theme.secondary, fontSize: "1.1em", marginBottom: "1em" }}>
              Prove You're Worthy
            </div>
            <div style={{ marginBottom: "1.2em", lineHeight: 1.5 }}>
              You take your seat in the Great Hall. Food appears with a flourish. The teachers all start conversing—now is your chance.<br /><br />
              You clear your throat and, with a swish and a flick, the jug floats over the staff table, completely unnoticed by Professor Snape. It tips slowly, soaking his robes.<br /><br />
              The students burst into uproarious laughter. Professor Snape is fuming. Now it is time to make your exit!
            </div>
            <button
              style={{
                background: theme.secondary,
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "0.7em 1.5em",
                fontWeight: "bold",
                fontSize: "1.02em",
                cursor: "pointer",
                marginTop: "1.2em"
              }}
              onClick={() => setQuestStep("rolling")}
            >
              Roll for Agility!
            </button>
          </>
        )}
        {questStep === "rolling" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "1.1em" }}>
              <b>Roll a d12 and add your Agility ({character.agility || 0})</b>
              <br />
              <span style={{ color: "#865c2c" }}>13 or higher: You make your escape!</span>
            </div>
            <button
              style={{
                background: theme.primary,
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "0.7em 1.5em",
                fontWeight: "bold",
                fontSize: "1.02em",
                cursor: "pointer",
                marginTop: "1.2em"
              }}
              onClick={rollForAgility}
            >
              Roll!
            </button>
          </div>
        )}
        {questStep === "result" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: "bold", marginBottom: "1em" }}>
              d12 + Agility = <span style={{ color: theme.secondary }}>{roll}</span>
            </div>
            {questResult === "success" ? (
              <>
                <div style={{ color: "#388e3c", marginBottom: "0.9em", fontWeight: "bold" }}>
                  You slip into the entrance hall where Peeves is waiting. He is ecstatic!
                  <br />+25 XP
                </div>
                <button
                  style={{
                    background: theme.secondary,
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.7em 1.5em",
                    fontWeight: "bold",
                    fontSize: "1.02em",
                    cursor: "pointer",
                    marginTop: "1em"
                  }}
                  onClick={closeQuestModal}
                >Continue</button>
              </>
            ) : (
              <>
                <div style={{ color: "#b71c1c", marginBottom: "0.9em", fontWeight: "bold" }}>
                  Professor Snape catches you!<br />
                  He gives you a detention and takes 10 points from {character.house}.<br />
                  (Peeves is disappointed, but you'll get another chance for mayhem!)
                </div>
                <button
                  style={{
                    background: theme.secondary,
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.7em 1.5em",
                    fontWeight: "bold",
                    fontSize: "1.02em",
                    cursor: "pointer",
                    marginTop: "1em"
                  }}
                  onClick={closeQuestModal}
                >Continue</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

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
        opacity: 0.6
      }}
    >
      <Link
        to="/school"
        style={{
          display: "inline-block",
          marginBottom: "1.2rem",
          background: "#af1e8c",
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
      <h2 style={{ color: "#af1e8c" }}>Peeves' Pests</h2>
      <div style={{ margin: "1.5rem 0 0 0", fontSize: "1.2em" }}>
        <p>
          Welcome to Peeves' secret club! Here you’ll find side quests all about causing magical mayhem across Hogwarts.
          <ol> <b><u>Rules of Peeves Pests!</u></b>
            <br />
            <li>All mayhem caused under the instruction of peeves to be marked with PP.</li>
            <li>We do not talk about Peeves Pests.</li>
            <li>Bonus points for mayhem caused whilst not under instruction.</li>
            <li>All mayhem should be caused to disturb and disrupt, not harm!</li>
          </ol>
        </p>
        <div style={{ margin: "2em 0" }}>
          {visibleQuests.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "#af1e8c" }}>
              (No active side quests right now!)
            </p>
          ) : (
            visibleQuests.map(q => (
              <div
                key={q.id}
                style={{
                  background: "#fffbe9",
                  borderRadius: "8px",
                  margin: "1.3em 0",
                  padding: "1em",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  borderLeft: `4px solid ${theme.secondary}`,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "background .13s"
                }}
                onClick={() => startQuest(q.id)}
                tabIndex={0}
                aria-label={`Start quest: ${q.title}`}
                title="Click to start quest"
              >
                <div style={{ fontWeight: "bold", fontSize: "1.10em", color: theme.secondary }}>{q.title}</div>
                <div style={{ fontStyle: "italic", color: "#af1e8c", margin: "0.45em 0 0.7em 0" }}>
                  {q.description}
                </div>
                <div style={{ color: "#888", fontSize: "0.95em" }}>(Click to begin)</div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Quest modal/dialog */}
      {(activeQuest === "worthy") && worthyQuestModal}
    </div>
  );
};

export default PeevesPests;

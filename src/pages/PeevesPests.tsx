import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Character } from "../types";
import { houseThemes } from "../themes";
import DiceButton from "../components/DiceButton"; // Adjust path if needed

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
    requiredSpell: "Wingardium Leviosa",
    completedFlag: "peevesWorthyQuestDone",
    rewardXP: 25
  },
];

interface Props {
  character: Character;
  setCharacter?: (char: Character) => void;
}

const getHouseKey = (house: string) => house.toLowerCase();

const PeevesPests: React.FC<Props> = ({ character, setCharacter }) => {
  const theme = houseThemes[character.house];
  const flags = character.flags || {};
  const unlockedSpells = character.unlockedSpells || [];

  // Tab state: "active" or "completed"
  const [tab, setTab] = useState<"active" | "completed">("active");
  const [activeQuest, setActiveQuest] = useState<string | null>(null);
  const [questStep, setQuestStep] = useState<"intro" | "rolling" | "result" | null>(null);
  const [roll, setRoll] = useState<number | null>(null);
  const [questResult, setQuestResult] = useState<"success" | "fail" | null>(null);
  const [diceModalOpen, setDiceModalOpen] = useState(false);

  // Only show active quests in "Active" tab
  const activeQuests = quests.filter(q => {
    if (q.requiredSpell && !unlockedSpells.includes(q.requiredSpell)) return false;
    if (q.requiredFlag && !flags[q.requiredFlag]) return false;
    if (q.completedFlag && flags[q.completedFlag]) return false;
    return true;
  });

  // Show completed quests in "Completed" tab
  const completedQuests = quests.filter(q => flags[q.completedFlag]);

  function startQuest(qid: string) {
    setActiveQuest(qid);
    setQuestStep("intro");
    setRoll(null);
    setQuestResult(null);
  }

  function handleDiceRoll(result: number, sides: number) {
    if (sides !== 12) return;
    const total = result + (character.agility || 0);
    setRoll(total);
    setQuestStep("result");
    setDiceModalOpen(false);

    const quest = quests.find(q => q.id === activeQuest);
    const alreadyCompleted = quest && flags[quest.completedFlag];

    if (total >= 13) {
      setQuestResult("success");
      // Only award XP on first completion
      if (setCharacter && quest && !alreadyCompleted) {
        setCharacter({
          ...character,
          experience: (character.experience || 0) + quest.rewardXP,
          flags: { ...flags, [quest.completedFlag]: true }
        });
      }
    } else {
      setQuestResult("fail");
      // Only penalize on first failure
      if (setCharacter && quest && !alreadyCompleted) {
        const houseKey = getHouseKey(character.house);
        const newPoints = Math.max(0, (character[houseKey] || 0) - 10);
        setCharacter({
          ...character,
          [houseKey]: newPoints,
          flags: { ...flags, [quest.completedFlag]: true, detention: true }
        });
      }
    }
  }

  function closeQuestModal() {
    setActiveQuest(null);
    setQuestStep(null);
    setRoll(null);
    setQuestResult(null);
    setDiceModalOpen(false);
  }

  // Modal/dialogue for the "worthy" quest (used in both tabs)
  const worthyQuestModal = (isReplay: boolean = false) => (
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
        {questStep === "intro" && (
          <>
            <div style={{ fontWeight: "bold", color: theme.secondary, fontSize: "1.1em", marginBottom: "1em" }}>
              Prove You're Worthy
              {isReplay && <span style={{ fontWeight: 400, fontSize: "0.9em", color: "#888" }}> (Replay)</span>}
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
              onClick={() => setDiceModalOpen(true)}
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
                  {isReplay ? null : (<><br />+25 XP</>)}
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
                  {isReplay && <div style={{ color: "#888", marginTop: 8 }}>(No house points lost on replay)</div>}
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
        {diceModalOpen && (
          <div
            style={{
              position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
              background: "rgba(0,0,0,0.18)", zIndex: 4100, display: "flex", alignItems: "center", justifyContent: "center"
            }}
            onClick={() => setDiceModalOpen(false)}
          >
            <div
              style={{
                background: "#fffbe9",
                border: `2px solid ${theme.secondary}`,
                borderRadius: "16px",
                minWidth: 180,
                minHeight: 120,
                zIndex: 4200,
                padding: "2rem",
                boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
              onClick={e => e.stopPropagation()}
            >
              <DiceButton
                allowedDice={[12]}
                highlightDice={12}
                showModal={true}
                onRoll={isReplay
                  ? (result, sides) => {
                      // Just for flavor, never award XP or house points on replay
                      setRoll(result + (character.agility || 0));
                      setQuestStep("result");
                      setDiceModalOpen(false);
                      setQuestResult(result + (character.agility || 0) >= 13 ? "success" : "fail");
                    }
                  : handleDiceRoll}
                onClose={() => setDiceModalOpen(false)}
              />
            </div>
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
      <br />
      <p>
        <ol>
        <u><b>Rules!!</b></u>
          <li>We do not talk about Peeves Pests!</li>
          <li>All mayhem caused under instruction of Peeves to be marked with PP!!</li>
          <li>Bonus points awarded for causing mayhem not under instruction!!</li>
          <li>All mayhem caused to disrupt or disturb, NOT harm!!</li>
          </ol>
      </p>
      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", margin: "1em 0 2em 0" }}>
        <button
          style={{
            background: tab === "active" ? theme.secondary : "#ece6da",
            color: tab === "active" ? "#fff" : "#222",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px 0 0 8px",
            padding: "0.6em 1.5em",
            cursor: tab === "active" ? "default" : "pointer",
            borderRight: "1px solid #ccc"
          }}
          onClick={() => setTab("active")}
          disabled={tab === "active"}
        >
          Active Quests
        </button>
        <button
          style={{
            background: tab === "completed" ? theme.secondary : "#ece6da",
            color: tab === "completed" ? "#fff" : "#222",
            fontWeight: "bold",
            border: "none",
            borderRadius: "0 8px 8px 0",
            padding: "0.6em 1.5em",
            cursor: tab === "completed" ? "default" : "pointer"
          }}
          onClick={() => setTab("completed")}
          disabled={tab === "completed"}
        >
          Completed Quests
        </button>
      </div>
      <div style={{ margin: "2em 0" }}>
        {tab === "active" ? (
          activeQuests.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "#af1e8c" }}>
              (No active side quests right now!)
            </p>
          ) : (
            activeQuests.map(q => (
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
          )
        ) : (
          completedQuests.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "#af1e8c" }}>
              (No completed side quests yet!)
            </p>
          ) : (
            completedQuests.map(q => (
              <div
                key={q.id}
                style={{
                  background: "#f2f2f2",
                  borderRadius: "8px",
                  margin: "1.3em 0",
                  padding: "1em",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  borderLeft: `4px solid ${theme.secondary}`,
                  textAlign: "left",
                  cursor: "pointer",
                  opacity: 0.9
                }}
                onClick={() => startQuest(q.id)}
                tabIndex={0}
                aria-label={`Replay quest: ${q.title}`}
                title="Replay this quest"
              >
                <div style={{ fontWeight: "bold", fontSize: "1.10em", color: theme.secondary }}>
                  {q.title} <span style={{ fontWeight: 400, fontSize: "0.92em", color: "#888" }}>(Completed)</span>
                </div>
                <div style={{ fontStyle: "italic", color: "#af1e8c", margin: "0.45em 0 0.7em 0" }}>
                  {q.description}
                </div>
                <div style={{ color: "#888", fontSize: "0.95em" }}>(Replay for fun)</div>
              </div>
            ))
          )
        )}
      </div>
      {/* Quest modal/dialog */}
      {(activeQuest === "worthy" && tab === "active") && worthyQuestModal(false)}
      {(activeQuest === "worthy" && tab === "completed") && worthyQuestModal(true)}
    </div>
  );
};

export default PeevesPests;

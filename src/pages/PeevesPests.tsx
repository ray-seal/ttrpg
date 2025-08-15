import React from "react";
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

const PeevesPests: React.FC<Props> = ({ character, setCharacter }) => {
  const theme = houseThemes[character.house];
  const flags = character.flags || {};
  const unlockedSpells = character.unlockedSpells || [];

  // Quests are visible if the requiredSpell is unlocked, requiredFlag (if any) is set, and completedFlag is not set
  const visibleQuests = quests.filter(q => {
    if (q.requiredSpell && !unlockedSpells.includes(q.requiredSpell)) return false;
    if (q.requiredFlag && !flags[q.requiredFlag]) return false;
    if (q.completedFlag && flags[q.completedFlag]) return false;
    return true;
  });

  function handleResult(q: typeof quests[0], passed: boolean) {
    if (!setCharacter) return;
    const newFlags = { ...flags, [q.completedFlag]: true };
    let newChar = { ...character, flags: newFlags };
    if (passed) {
      newChar = { ...newChar, experience: (newChar.experience || 0) + (q.rewardXP || 0) };
      alert(`You succeed! Peeves is delighted. (+${q.rewardXP} XP)`);
    } else {
      // Optionally mark a detention flag here for future logic
      // newFlags.detention = true;
      alert("You failed! Professor Snape gives you detention!");
    }
    setCharacter(newChar);
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
                  textAlign: "left"
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: "1.10em", color: theme.secondary }}>{q.title}</div>
                <div style={{ fontStyle: "italic", color: "#af1e8c", margin: "0.45em 0 0.7em 0" }}>
                  {q.description}
                </div>
                {setCharacter && (
                  <div style={{ marginTop: 6 }}>
                    <button
                      style={{
                        background: "#43a047",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.5em 1.2em",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "1em",
                        marginRight: 8,
                      }}
                      onClick={() => handleResult(q, true)}
                    >
                      Succeed
                    </button>
                    <button
                      style={{
                        background: "#b71c1c",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.5em 1.2em",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "1em"
                      }}
                      onClick={() => handleResult(q, false)}
                    >
                      Fail
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PeevesPests;

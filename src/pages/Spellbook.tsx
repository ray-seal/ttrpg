import React from "react";
import { Link } from "react-router-dom";
import { Character } from "../types";
import { houseThemes } from "../themes";

const SPELLS = [
  {
    category: "Standard Book of Spells, Grade 1",
    spells: [
      { key: "Alohomora", name: "Alohomora", desc: "Unlocking Charm" },
      { key: "Lumos", name: "Lumos", desc: "Wand-Lighting Charm" },
      { key: "Wingardium Leviosa", name: "Wingardium Leviosa", desc: "Levitation Charm" },
      { key: "Incendio", name: "Incendio", desc: "Fire-Making Spell" },
      { key: "Nox", name: "Nox", desc: "Wand-Extinguishing Charm" }
    ]
  },
  {
    category: "Standard Book of Spells, Grade 2",
    spells: [
      { key: "Petrificus Totalus", name: "Petrificus Totalus", desc: "Full Body-Bind Curse" },
      { key: "Finite Incantatem", name: "Finite Incantatem", desc: "General Counter-Spell" },
      { key: "Expelliarmus", name: "Expelliarmus", desc: "Disarming Charm" },
      { key: "Locomotor Mortis", name: "Locomotor Mortis", desc: "Leg-Locker Curse" },
      { key: "Ennervate", name: "Ennervate", desc: "Reviving Spell" }
    ]
  },
  {
    category: "Defences",
    spells: [
      { key: "Devil's Snare Escape", name: "Devil's Snare Escape", desc: "Plant-repelling technique" },
      { key: "Obliviate", name: "Obliviate", desc: "Memory Charm" }
    ]
  },
  {
    category: "Curses",
    spells: [
      // Add more curses here as you expand
    ]
  }
];

interface Props {
  character: Character;
  setCharacter?: (char: Character) => void;
}

const Spellbook: React.FC<Props> = ({ character }) => {
  const theme = houseThemes[character.house];
  const unlocked = character.unlockedSpells || [];

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
        opacity: 0.6,
        position: "relative",
      }}
    >
      <Link
        to={document.referrer.startsWith(window.location.origin) ? -1 : "/character-sheet"}
        style={{
          display: "inline-block",
          marginBottom: "1.2rem",
          background: theme.secondary,
          color: "#fff",
          padding: "0.7rem 1.3rem",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "1rem",
        }}
      >
        Back
      </Link>
      <h2>Spellbook</h2>
      {SPELLS.map(group => (
        <div
          key={group.category}
          style={{
            margin: "2rem 0 2rem 0",
            background: "#ece6da",
            borderRadius: "10px",
            padding: "1.2rem 1rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.07)",
            opacity: 0.97,
          }}
        >
          <h3 style={{
            color: theme.secondary,
            margin: "0 0 0.7em 0",
            fontWeight: "bold",
            fontSize: "1.13em",
            letterSpacing: "0.02em"
          }}>{group.category}</h3>
          <div>
            {group.spells.length === 0 ? (
              <div style={{ color: "#b71c1c", fontStyle: "italic", marginBottom: "1em" }}>No spells yet.</div>
            ) : (
              group.spells.map(spell => {
                const isUnlocked = unlocked.includes(spell.key);
                return (
                  <div
                    key={spell.key}
                    style={{
                      background: isUnlocked ? "#fffbe9" : "#e0e0e0",
                      borderRadius: "8px",
                      margin: "0.5em 0",
                      padding: "0.7em 1em",
                      textAlign: "left",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                      borderLeft: isUnlocked ? `4px solid ${theme.secondary}` : "4px solid #bbb",
                      fontFamily: "serif"
                    }}
                  >
                    <div style={{
                      fontWeight: "bold",
                      fontSize: "1.05em",
                      color: isUnlocked ? theme.primary : "#888"
                    }}>
                      {isUnlocked ? spell.name : "???"}
                    </div>
                    <div style={{
                      fontStyle: "italic",
                      color: isUnlocked ? theme.secondary : "#bbb"
                    }}>
                      {isUnlocked ? spell.desc : "???"}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Spellbook;

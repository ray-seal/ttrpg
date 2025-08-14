import React from "react";
import { Character } from "../types";
import { houseThemes } from "../themes";
import { Link } from "react-router-dom";

// Example spell data: group by book and year 1 only for now
const SPELLS = [
  {
    name: "Lumos",
    book: "Standard Book of Spells Grade 1",
    year: 1,
    description: "Creates light at the wand tip.",
  },
  {
    name: "Alohomora",
    book: "Standard Book of Spells Grade 1",
    year: 1,
    description: "Unlocks doors and objects.",
  },
  {
    name: "Wingardium Leviosa",
    book: "Standard Book of Spells Grade 1",
    year: 1,
    description: "Makes objects fly.",
  },
  {
    name: "Petrificus Totalus",
    book: "First Year Curses",
    year: 1,
    description: "Full-body bind curse.",
  },
  {
    name: "Incendio",
    book: "Standard Book of Spells Grade 1",
    year: 1,
    description: "Creates fire.",
  },
  {
    name: "Nox",
    book: "Standard Book of Spells Grade 1",
    year: 1,
    description: "Extinguishes Lumos light.",
  },
  {
    name: "Finite Incantatem",
    book: "First Year General Spells",
    year: 1,
    description: "Cancels spell effects.",
  },
  {
    name: "Expelliarmus",
    book: "First Year Duels",
    year: 1,
    description: "Disarms your opponent.",
  },
  {
    name: "Devil's Snare Escape",
    book: "Magical Plants 1",
    year: 1,
    description: "Resist magical plants.",
  },
  {
    name: "Obliviate",
    book: "First Year Charms",
    year: 1,
    description: "Erases memories.",
  },
  {
    name: "Locomotor Mortis",
    book: "First Year Curses",
    year: 1,
    description: "Leg-locker curse.",
  },
  {
    name: "Ennervate",
    book: "First Year Charms",
    year: 1,
    description: "Revives a stunned person.",
  },
];

const MAX_SLOTS = 4;

// Group spells by book for a given year
function groupSpellsByBook(year: number) {
  const grouped: Record<string, typeof SPELLS> = {};
  SPELLS.filter(s => s.year === year).forEach(spell => {
    if (!grouped[spell.book]) grouped[spell.book] = [];
    grouped[spell.book].push(spell);
  });
  return grouped;
}

interface SpellBookProps {
  character: Character;
  setCharacter: (c: Character) => void;
}

const SpellBook: React.FC<SpellBookProps> = ({ character, setCharacter }) => {
  const theme = houseThemes[character.house];
  const unlockedSpells = character.unlockedSpells ?? [];
  const equipped = character.equippedSpells ?? [];

  // For add/remove equip
  function toggleEquip(spell: string) {
    if (equipped.includes(spell)) {
      setCharacter({
        ...character,
        equippedSpells: equipped.filter(s => s !== spell),
      });
    } else if (equipped.length < MAX_SLOTS) {
      setCharacter({
        ...character,
        equippedSpells: [...equipped, spell],
      });
    }
  }

  const groupedSpells = groupSpellsByBook(1);

  return (
    <div
      style={{
        background: theme.background,
        color: theme.primary,
        border: `2px solid ${theme.secondary}`,
        borderRadius: "16px",
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "2rem",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        fontFamily: "serif",
      }}
    >
      <Link
        to="/character-sheet"
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
        Back to Character Sheet
      </Link>
      <h2 style={{ textAlign: "center", marginBottom: "1.2rem" }}>Your Spellbook</h2>
      <div style={{ textAlign: "center", marginBottom: "1.1rem" }}>
        <b>Spell Slots:</b> {equipped.length} / {MAX_SLOTS}
        <div style={{ fontSize: "0.97em", color: theme.secondary, marginTop: "0.2em" }}>
          {equipped.length === 0
            ? "No spells equipped"
            : equipped.join(", ")}
        </div>
        <div style={{ fontSize: "0.80em", color: "#666", marginTop: "0.4em" }}>
          Click a spell to equip/unequip (max {MAX_SLOTS}).
        </div>
      </div>
      {Object.entries(groupedSpells).map(([book, spells]) => (
        <div key={book} style={{
          background: theme.accent,
          borderRadius: "10px",
          padding: "1rem",
          marginBottom: "1.5rem",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}>
          <h3 style={{ marginBottom: "0.7em", color: theme.primary }}>{book}</h3>
          {spells.map(spell => {
            const isUnlocked = unlockedSpells.includes(spell.name);
            const isEquipped = equipped.includes(spell.name);
            return (
              <div
                key={spell.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.8em",
                  padding: "0.5em 0.3em",
                  borderBottom: `1px dashed ${theme.secondary}`,
                  opacity: isUnlocked ? 1 : 0.65,
                }}
              >
                <div>
                  <span style={{
                    fontWeight: isUnlocked ? "bold" : "normal",
                    fontFamily: "serif",
                    color: isUnlocked ? theme.primary : "#aaa",
                  }}>
                    {isUnlocked ? spell.name : "???"}
                  </span>
                  {isUnlocked && (
                    <span style={{
                      fontSize: "0.92em",
                      color: theme.secondary,
                      marginLeft: "0.5em"
                    }}>
                      ({spell.description})
                    </span>
                  )}
                </div>
                {isUnlocked && (
                  <button
                    onClick={() => toggleEquip(spell.name)}
                    disabled={!isEquipped && equipped.length >= MAX_SLOTS}
                    style={{
                      background: isEquipped ? theme.primary : "#f7f7f7",
                      color: isEquipped ? "#fff" : theme.primary,
                      border: isEquipped ? `2px solid ${theme.secondary}` : `1px solid ${theme.primary}`,
                      borderRadius: "8px",
                      padding: "0.35em 1.2em",
                      fontWeight: isEquipped ? "bold" : "normal",
                      marginLeft: "0.7em",
                      cursor: !isEquipped && equipped.length >= MAX_SLOTS ? "not-allowed" : "pointer",
                      opacity: !isEquipped && equipped.length >= MAX_SLOTS ? 0.6 : 1,
                    }}
                  >
                    {isEquipped ? "Equipped" : "Add to Slot"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ))}
      <div style={{ textAlign: "center", color: theme.secondary, marginTop: "1.5rem", fontSize: "0.95em" }}>
        Locked spells will reveal themselves as you progress!
      </div>
    </div>
  );
};

export default SpellBook;

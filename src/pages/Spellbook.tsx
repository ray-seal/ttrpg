import React, { useState } from "react";
import { Character } from "../types";
import { Link } from "react-router-dom";

// Example spell data -- you may want to move this to a separate file!
const SPELLS = [
  {
    name: "Lumos",
    book: "Standard Book of Spells Grade 1",
    description: "Creates light at the wand tip.",
  },
  {
    name: "Alohomora",
    book: "Standard Book of Spells Grade 1",
    description: "Unlocks doors and objects.",
  },
  {
    name: "Expelliarmus",
    book: "Standard Book of Spells Grade 2",
    description: "Disarms your opponent.",
  },
  {
    name: "Wingardium Leviosa",
    book: "Standard Book of Spells Grade 1",
    description: "Makes objects fly.",
  },
  // Add more spells here as you wish
];

// Group spells by book
function groupSpellsByBook() {
  const grouped: Record<string, typeof SPELLS> = {};
  SPELLS.forEach(spell => {
    if (!grouped[spell.book]) grouped[spell.book] = [];
    grouped[spell.book].push(spell);
  });
  return grouped;
}

const MAX_SLOTS = 4;

interface SpellBookProps {
  character: Character;
  setCharacter: (c: Character) => void;
}

const SpellBook: React.FC<SpellBookProps> = ({ character, setCharacter }) => {
  const groupedSpells = groupSpellsByBook();
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

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.75)",
        borderRadius: "16px",
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "2rem",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        fontFamily: "serif",
        color: "#222",
      }}
    >
      <Link
        to="/character-sheet"
        style={{
          display: "inline-block",
          marginBottom: "1.2rem",
          background: "#4287f5",
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
        <div style={{ fontSize: "0.97em", color: "#4287f5", marginTop: "0.2em" }}>
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
          background: "#ece6da",
          borderRadius: "10px",
          padding: "1rem",
          marginBottom: "1.5rem",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}>
          <h3 style={{ marginBottom: "0.7em", color: "#865c2c" }}>{book}</h3>
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
                  borderBottom: "1px dashed #cabca7",
                  opacity: isUnlocked ? 1 : 0.65,
                }}
              >
                <div>
                  <span style={{
                    fontWeight: isUnlocked ? "bold" : "normal",
                    fontFamily: "serif",
                    color: isUnlocked ? "#222" : "#aaa",
                  }}>
                    {isUnlocked ? spell.name : "???"}
                  </span>
                  {isUnlocked && (
                    <span style={{
                      fontSize: "0.92em",
                      color: "#7a6341",
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
                      background: isEquipped ? "#865c2c" : "#eee",
                      color: isEquipped ? "#fff" : "#865c2c",
                      border: "none",
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
      <div style={{ textAlign: "center", color: "#a88132", marginTop: "1.5rem", fontSize: "0.95em" }}>
        Locked spells will reveal themselves as you progress!
      </div>
    </div>
  );
};

export default SpellBook;

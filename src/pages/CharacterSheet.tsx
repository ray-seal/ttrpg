import React from "react";
import { Link } from "react-router-dom";
import { Character } from "../types";
import { houseThemes } from "../themes";

// Book icon SVG for spellbook button
const BookIcon = () => (
  <svg
    width={64}
    height={64}
    viewBox="0 0 64 64"
    aria-hidden="true"
    focusable="false"
    style={{ display: "block" }}
  >
    <rect x="8" y="12" width="48" height="40" rx="6" fill="#e6ddb8" stroke="#865c2c" strokeWidth={3}/>
    <rect x="16" y="18" width="32" height="28" rx="2" fill="#fffbe9" />
    <path d="M32 18 v28" stroke="#c5ae86" strokeWidth={2}/>
    <text x="32" y="54" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#865c2c">Book</text>
  </svg>
);

// Define all spells (should match Spellbook)
const ALL_SPELLS = [
  "Alohomora",
  "Lumos",
  "Wingardium Leviosa",
  "Incendio",
  "Nox",
  "Petrificus Totalus",
  "Finite Incantatem",
  "Expelliarmus",
  "Locomotor Mortis",
  "Ennervate",
  "Devil's Snare Escape",
  "Obliviate"
];

interface Props {
  character: Character;
  setCharacter?: (char: Character) => void;
}

const CharacterSheet: React.FC<Props> = ({ character, setCharacter }) => {
  const theme = houseThemes[character.house];

  // Use equippedSpells from character, or empty array by default
  const equippedSpells: string[] = character.equippedSpells || [];

  // Unlocked spells (should be a string array of spell keys)
  const unlockedSpells: string[] = character.unlockedSpells || [];

  // Handler: equip or unequip spell
  const handleEquip = (spell: string) => {
    if (!setCharacter) return;
    // If already equipped, unequip it
    if (equippedSpells.includes(spell)) {
      setCharacter({ ...character, equippedSpells: equippedSpells.filter(s => s !== spell) });
    } else {
      // If less than 4 equipped, equip new one
      if (equippedSpells.length < 4) {
        setCharacter({ ...character, equippedSpells: [...equippedSpells, spell] });
      } else {
        // Optionally could show a warning/alert here if you want
        alert("You can only equip up to 4 spells at a time!");
      }
    }
  };

  return (
    <div
      style={{
        border: `2px solid ${theme.secondary}`,
        background: "rgba(255,255,255,0.60)",
        color: theme.primary,
        padding: "2rem",
        borderRadius: "16px",
        maxWidth: "420px",
        margin: "2rem auto",
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        fontFamily: "serif",
        position: "relative",
      }}
    >
      <Link
        to="/"
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
        Back to Home
      </Link>
      <h2 style={{ color: theme.secondary, marginBottom: "0.5rem" }}>
        {character.name || "Unnamed Wizard"}
      </h2>
      <div>
        <strong>House:</strong> {character.house}
      </div>
      <div>
        <strong>XP:</strong> {character.experience}
      </div>
      <hr style={{ margin: "1rem 0", borderColor: theme.accent, opacity: 0.3 }} />
      <div>
        <strong>Magic:</strong> {character.magic}
      </div>
      <div>
        <strong>Knowledge:</strong> {character.knowledge}
      </div>
      <div>
        <strong>Courage:</strong> {character.courage}
      </div>
      <div>
        <strong>Agility:</strong> {character.agility}
      </div>
      <div>
        <strong>Charisma:</strong> {character.charisma}
      </div>

      {/* Equipped Spells */}
      <hr style={{ margin: "1.2rem 0 0.7rem 0", borderColor: theme.secondary, opacity: 0.4 }} />
      <div style={{ marginBottom: "0.6rem" }}>
        <strong>Equipped Spells</strong>
        <span style={{ color: "#865c2c", fontWeight: 400, marginLeft: 8 }}>(max 4)</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", minHeight: "2.2rem" }}>
        {equippedSpells.length === 0 && (
          <span style={{ color: "#a09f92", fontStyle: "italic" }}>No spells equipped</span>
        )}
        {equippedSpells.map(spell => (
          <span
            key={spell}
            style={{
              background: theme.secondary,
              color: "#fff",
              padding: "0.3em 0.8em",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1.01em",
              display: "inline-block"
            }}
          >
            {spell}
            {setCharacter && (
              <button
                aria-label={`Unequip ${spell}`}
                title="Unequip"
                onClick={() => handleEquip(spell)}
                style={{
                  marginLeft: 6,
                  background: "#fff",
                  color: theme.secondary,
                  border: "none",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "1em",
                  lineHeight: "1",
                  verticalAlign: "middle",
                  boxShadow: "0 0 2px #0002",
                }}
              >×</button>
            )}
          </span>
        ))}
      </div>

      {/* Equip Spells Section */}
      {setCharacter && (
        <>
          <div style={{ margin: "1.1rem 0 0.5rem 0", fontWeight: "bold" }}>Equip Spells</div>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            justifyContent: "flex-start",
            marginBottom: "1.2rem"
          }}>
            {ALL_SPELLS.filter(s => unlockedSpells.includes(s)).map(spell => (
              <button
                key={spell}
                onClick={() => handleEquip(spell)}
                disabled={
                  equippedSpells.includes(spell) ||
                  (equippedSpells.length >= 4 && !equippedSpells.includes(spell))
                }
                style={{
                  background: equippedSpells.includes(spell) ? theme.secondary : theme.primary,
                  color: "#fff",
                  padding: "0.4em 1em",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "bold",
                  opacity: equippedSpells.includes(spell) ? 0.7 : 1,
                  cursor: equippedSpells.includes(spell)
                    ? "not-allowed"
                    : equippedSpells.length >= 4
                    ? "not-allowed"
                    : "pointer",
                  fontSize: "1em",
                  transition: "background .15s"
                }}
                aria-label={equippedSpells.includes(spell) ? "Equipped" : `Equip ${spell}`}
                title={equippedSpells.includes(spell) ? "Already equipped" : `Equip ${spell}`}
              >
                {spell}
                {equippedSpells.includes(spell) ? " ✓" : ""}
              </button>
            ))}
            {ALL_SPELLS.filter(s => unlockedSpells.includes(s)).length === 0 && (
              <span style={{ color: "#aaa" }}>No unlocked spells yet</span>
            )}
          </div>
        </>
      )}

      {/* Floating Spellbook button */}
      <Link
        to="/spellbook"
        style={{
          position: "fixed",
          left: "2rem",
          bottom: "2rem",
          zIndex: 2000,
          width: "64px",
          height: "64px",
          border: "none",
          background: "none",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textDecoration: "none"
        }}
        aria-label="Open Spellbook"
      >
        <BookIcon />
        <span style={{
          fontSize: "0.95rem",
          color: "#865c2c",
          fontWeight: "bold",
          marginTop: "0.2em"
        }}>Spellbook</span>
      </Link>
    </div>
  );
};

export default CharacterSheet;

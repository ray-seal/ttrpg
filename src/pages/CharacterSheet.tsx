import React from "react";
import { Link } from "react-router-dom";
import { Character } from "../types";
import { houseThemes } from "../themes";

// You can use your own book image, or a simple SVG as below:
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

interface Props {
    character: Character;
}

const CharacterSheet: React.FC<Props> = ({ character }) => {
    const theme = houseThemes[character.house];

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

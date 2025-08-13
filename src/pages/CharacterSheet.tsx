import React from "react";
import { Link } from "react-router-dom";
import { Character } from "../types";

interface CharacterSheetProps {
    character: Character;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character }) => {
    return (
        <div
            style={{
                background: "#fff",
                color: "#222",
                padding: "2rem",
                borderRadius: "16px",
                maxWidth: "500px",
                margin: "3rem auto",
                boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                fontFamily: "serif",
                textAlign: "center",
            }}
        >
            <Link
                to="/"
                style={{
                    display: "inline-block",
                    marginBottom: "1.5rem",
                    background: "#4287f5",
                    color: "#fff",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "1rem"
                }}
            >
                Back to Home
            </Link>
            <h2>Character Sheet</h2>
            <div style={{ textAlign: "left", margin: "0 auto", maxWidth: "320px" }}>
                <p><strong>Name:</strong> {character.name}</p>
                <p><strong>House:</strong> {character.house}</p>
                <p><strong>Level:</strong> {character.level}</p>
                <p><strong>Experience:</strong> {character.experience}</p>
                <p><strong>Magic:</strong> {character.magic}</p>
                <p><strong>Knowledge:</strong> {character.knowledge}</p>
                <p><strong>Bravery:</strong> {character.bravery}</p>
                <p><strong>Unlocked Spells:</strong> {character.unlockedSpells && character.unlockedSpells.length > 0
                    ? character.unlockedSpells.join(", ")
                    : "None"}
                </p>
            </div>
        </div>
    );
};

export default CharacterSheet;

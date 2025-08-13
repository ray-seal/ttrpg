import React from "react";
import { Link } from "react-router-dom";
import { Character } from "../types";
import { houseThemes } from "../themes";

interface Props {
    character: Character;
}

const CharacterSheet: React.FC<Props> = ({ character }) => {
    const theme = houseThemes[character.house];

    return (
        <div
            style={{
                border: `2px solid ${theme.secondary}`,
                background: theme.background,
                color: theme.primary,
                padding: "2rem",
                borderRadius: "12px",
                maxWidth: "400px",
                margin: "2rem auto",
                boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                fontFamily: "serif",
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
                <strong>Level:</strong> {character.level}
            </div>
            <div>
                <strong>XP:</strong> {character.experience}
            </div>
            <hr style={{ margin: "1rem 0", borderColor: theme.accent }} />
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
            <hr style={{ margin: "1rem 0", borderColor: theme.accent }} />
            <div>
                <strong>Spell Slots:</strong> {character.spellSlots ?? 0}
            </div>
            <div>
                <strong>Unlocked Spells:</strong> {character.unlockedSpells?.length
                    ? character.unlockedSpells.join(", ")
                    : "None"
                }
            </div>
        </div>
    );
};

export default CharacterSheet;

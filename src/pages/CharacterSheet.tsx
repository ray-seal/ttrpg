import React from "react";
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
            border: '2px solid ${theme.secondary}',
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
            </div>
    );
};

export default CharacterSheet;
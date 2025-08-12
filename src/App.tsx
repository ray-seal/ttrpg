import React, { useState, useEffect } from "react";
import CharacterCreation from './pages/CharacterCreation';
import CharacterSheet from "./pages/CharacterSheet";
import { houseThemes, House } from "./themes";
import { Character } from "./types";
import DiceButton from "./components/DiceButton";
import HouseShield from "./components/HouseShield";

const CHARACTER_KEY = "character";

function loadCharacter(): Character | null {
    const saved = localStorage.getItem(CHARACTER_KEY);
    return saved ? JSON.parse(saved) : null;
}

function saveCharacter(char: Character) {
    localStorage.setItem(CHARACTER_KEY, JSON.stringify(char));
}

function getAllowedDice(character: Character | null): number[] {
    if (!character) return [4, 6, 8, 10, 12, 20];
    if (character.magic <= 6) return [4, 6];
    if (character.magic <= 8) return [4, 6, 8];
    if (character.magic >= 10) return [4, 6, 8, 10, 12, 20];
    return [4, 6, 8, 10, 12, 20];
}

const App: React.FC = () => {
    const [character, setCharacter] = useState<Character | null>(loadCharacter());

    useEffect(() => {
        if (character) saveCharacter(character);
    }, [character]);

    const currentHouse = character?.house as House | undefined;
    const theme = currentHouse ? houseThemes[currentHouse] : houseThemes.Gryffindor;

    function addExperience(points: number) {
        setCharacter(prev => {
            if (!prev) return prev;
            const newExp = prev.experience + points;
            let newLevel = prev.level;
            // level up for every 100xp
            if (newExp >= prev.level * 100) {
                newLevel += 1;
            }
            return { ...prev, experience: newExp, level: newLevel };
        });
    }

    return (
    <div 
    style={{
        minHeight: "100vh",
        position: "relative",
        background: theme.background,
        color: theme.primary,
        overflow: "hidden",
        fontFamily: "monospace",
    }}
    >

        {currentHouse && <HouseShield house={currentHouse} />}

        <div
        style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
        }}
        >
        <h1 style={{ color: theme.primary, textAlign: "center" }}>Harry Potter TTRPG
        </h1>
        {!character && <CharacterCreation onCreate={setCharacter} />}
        {character && (
            <>
            <CharacterSheet character={character} />
            <div style={{ textAlign: "center" }}>
                <button
                onClick={() => addExperience(50)}
                style={{
                    background: theme.secondary,
                    color: theme.primary,
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.75rem 1.5rem",
                    marginTop: "1rem",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "1rem",
                }}
                >
                    Earn 50 XP
                </button>
                </div>
                </>
        )}
        </div>
    
<DiceButton allowedDice={getAllowedDice(character)} />
</div>
    );
};

export default App;
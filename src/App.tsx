import React, { useState, useEffect } from "react";
import CharacterCreation from './pages/CharacterCreation';
import { houseThemes, House } from "./themes";
import { Character } from "./types";

const CHARACTER_KEY = "character";

function loadCharacter(): Character | null {
    const saved = localStorage.getItem(CHARACTER_KEY);
    return saved ? JSON.parse(saved) : null;
}

function saveCharacter(char: Character) {
    localStorage.setItem(CHARACTER_KEY, JSON.stringify(char));

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
            return { ...prev, expeerience: newExp, level: newLevel };
        });
    }

    return (
    <div style={{
        background: theme.background,
        color: theme.primary,
        minHeight: '100vh',
        fontFamily: 'monospace',
        transition: 'background 0.3s, color 0.3s'
    }}>
        <h1 style={{ color: theme.primary }}>Harry Potter TTRPG</h1>
        <CharacterCreation onCreate={setCharacter} />
        {character && (
            <div style={{ marginTop: "2rem", border: '2px solid ${theme.secondary}', padding: "1rem" }}>
                <h2 style={{ color: theme.secondary }}>Your Character</h2>
                <pre>{JSON.stringify(character, null, 2)}</pre>
                </div>
        )}
        </div>
        );
    };

export default App;
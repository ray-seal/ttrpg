import React, { useState } from "react";
import CharacterCreation, { Character } from './pages/CharacterCreation';
import { houseThemes, House } from "./themes";

const App: React.FC = () => {
    const [character, setCharacter] = useState<Character | null>(null);

    const currentHouse = character?.house as House | undefined;
    const theme = currentHouse ? houseThemes[currentHouse] : houseThemes.Gryffindor;

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
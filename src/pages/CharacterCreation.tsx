import React, { useState } from 'react';
import { House } from '../themes';
import { Character } from "../types";

const houses: House[] = ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"];

const defaultStats = {
    magic: 5,
    knowledge: 5,
    courage: 5,
    agility: 5,
    charisma: 5,
};

const CharacterCreation: React.FC<{ onCreate: (c: Character) => void }> = ({ onCreate }) => {
    const [character, setCharacter] = useState<Character>({
        name: "",
        house: houses[0],
        ...defaultStats,
        level: 1,
        experience: 0,
    });

    const statNames = Object.keys(defaultStats) as (keyof typeof defaultStats)[];

    const handleChange = (field: keyof Character, value: string | number) => {
        setCharacter(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div>
        <h2>Create Your Character</h2>
        <label>
        Name:
        <input
        type="text"
        value={character.name}
        onChange={e => handleChange("name", e.target.value)}
        />
        </label>
        <br />
        <label>
            House:
            <select
            value={character.house}
            onChange={e => handleChange("house", e.target.value)}
            >
                {houses.map(house => (
                    <option key={house} value={house}>{house}</option>
                ))}
            </select>
        </label>
        <br />
        <h3>Stats</h3>
        {statNames.map(stat => (
            <div key={stat}>
                {stat.charAt(0).toUpperCase() + stat.slice(1)}:
                <input
                type="number"
                min={1}
                max={10}
                value={character[stat]}
                onChange={e => handleChange(stat, Number(e.target.value))}
                />
            </div>
    ))}
    <br />
    <button onClick={() => onCreate(character)}>Create Character</button>
    </div>
    );
};

export default CharacterCreation;
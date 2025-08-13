import React, { useState } from 'react';
import { Character, House } from "../types";

const DEFAULT_ATTRIBUTE = 5;
const STARTING_POINTS = 5;

interface CharacterCreationProps {
    onCreate: (character: Character) => void;
}

const houseOptions: House[] = ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"];

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCreate }) => {
    const [name, setName] = useState("");
    const [house, setHouse] = useState<House | "">("");
    const [attributes, setAttributes] = useState({
        magic: DEFAULT_ATTRIBUTE,
        knowledge: DEFAULT_ATTRIBUTE,
        courage: DEFAULT_ATTRIBUTE,
        agility: DEFAULT_ATTRIBUTE,
        charisma: DEFAULT_ATTRIBUTE,
    });
    const [pointsLeft, setPointsLeft] = useState(STARTING_POINTS);

    const handleAttributeChange = (attr: keyof typeof attributes, delta: number) => {
        if (delta > 0 && pointsLeft === 0) return;
        if (delta < 0 && attributes[attr] <= DEFAULT_ATTRIBUTE) return;

        setAttributes(prev => ({
            ...prev,
            [attr]: prev[attr] + delta,
        }));
        setPointsLeft(prev => prev - delta);
    };

    const handleCreate = () => {
        if (!name || !house || pointsLeft !== 0) return;
        onCreate({
            name,
            house: house as House,
            magic: attributes.magic,
            knowledge: attributes.knowledge,
            courage: attributes.courage,
            agility: attributes.agility,
            charisma: attributes.charisma,
            level: 1,
            experience: 0,
        });
    };

    return (
        <div style={{
            background: "#f7f7f7",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            minWidth: "300px",
            margin: "2rem auto"
        }}>
        <h2 style={{ textAlign: "center" }}>Create Your Character</h2>
        <div style={{ marginBottom: "1rem" }}>
        <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        />
        <select
            value={house}
            onChange={e => setHouse(e.target.value as House)}
            style={{ padding: "0.5rem", fontSize: "1rem", width: "100%" }}
            >
                <option value="">Select House</option>
                {houseOptions.map(h => (
                    <option key={h}>{h}</option>
                ))}
                </select>
                </div>
                <div style={{ margin: "1rem 0", textAlign: "center" }}>
                    <div style={{ marginBottom: "0.5rem" }}>
            <p>Distribute {pointsLeft} points</p>
            </div>
            {(["magic", "knowledge", "courage", "agility", "charisma"] as const).map(attr => (
                <div key={attr} style={{ margin: "0.5rem 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ width: "110px", textTransform: "capitalize" }}>
                        {attr}: <b>{attributes[attr]}</b>
                        </span>
                    <button
                    onClick={() => handleAttributeChange(attr, 1)}
                    disabled={pointsLeft === 0}
                    style={{
                        margin: "0 0.5rem", padding: "0.25rem 0.75rem", fontWeight: "bold",
                        borderRadius: "4px", border: "1px solid #ccc", background: pointsLeft === 0 ? "#eee" : "#dff0d8", cursor: pointsLeft === 0 ? "not-allowed" : "pointer"
                    }}
                    >+</button>
                    <button
                    onClick={() => handleAttributeChange(attr, -1)}
                    disabled={attributes[attr] === DEFAULT_ATTRIBUTE}
                    style={{
                        margin: "0 0.5rem", padding: "0.25rem 0.75rem", fontWeight: "bold",
                        borderRadius: "4px", border: "1px solid #ccc", background: attributes[attr] === DEFAULT_ATTRIBUTE ? "#eee" : "#f2dede", cursor: attributes[attr] === DEFAULT_ATTRIBUTE ? "not-allowed" : "pointer"
                    }}
                    >-</button>
                    </div>
            ))}
        </div>
    <button 
    onClick={handleCreate}
    disabled={!name || !house || pointsLeft !== 0}
    style={{
        width: "100%", padding: "0.75rem", fontSize: "1.1rem", marginTop: "1rem",
        background: (!name || !house || pointsLeft !== 0) ? "#eee" : "#4287f5",
        color: (!name || !house || pointsLeft !== 0) ? "#999" : "#fff",
        border: "none", borderRadius: "8px", fontWeight: "bold",
        cursor: (!name || !house || pointsLeft !== 0) ? "not-allowed" : "pointer"
    }}
    >
        Create Character
        </button>
        </div>
    );
};

export default CharacterCreation;
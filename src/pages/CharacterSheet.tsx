import React, { useState } from "react";
import { Character } from "../types";
import { houseThemes } from "../themes";

interface Props {
    character: Character;
}

const MAX_EQUIPPED = 4;

const CharacterSheet: React.FC<Props> = ({ character }) => {
    const theme = houseThemes[character.house];
    const knownSpells = character.unlockedSpells ?? [];
    // For demo: store equipped spells in local state (in a campaign you might want to store this on the character object or in app state)
    const [equipped, setEquipped] = useState<string[]>(knownSpells.slice(0, MAX_EQUIPPED));

    function toggleEquip(spell: string) {
        if (equipped.includes(spell)) {
            setEquipped(equipped.filter(s => s !== spell));
        } else if (equipped.length < MAX_EQUIPPED) {
            setEquipped([...equipped, spell]);
        }
    }

    return (
        <div
            style={{
                border: `2px solid ${theme.secondary}`,
                background: "rgba(255,255,255,0.60)", // More transparent
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
            {/* Name, House, XP */}
            <div style={{ marginBottom: "1rem" }}>
                <h2 style={{ color: theme.secondary, margin: "0 0 0.25em" }}>
                    {character.name || "Unnamed Wizard"}
                </h2>
                <div>
                    <strong>House:</strong> {character.house}
                </div>
                <div>
                    <strong>XP:</strong> {character.experience}
                </div>
            </div>
            <hr style={{ margin: "1rem 0", borderColor: theme.accent, opacity: 0.3 }} />

            {/* Attributes */}
            <div style={{ marginBottom: "1rem" }}>
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

            <hr style={{ margin: "1rem 0", borderColor: theme.accent, opacity: 0.3 }} />

            {/* Spell slots / Equipped spells */}
            <div style={{ marginBottom: "1rem" }}>
                <strong>Spell Slots:</strong> {equipped.length} / {MAX_EQUIPPED}
                <div style={{ fontSize: "0.95em", marginTop: "0.5em", color: theme.secondary }}>
                    {equipped.length === 0 ? "No spells equipped" : equipped.join(", ")}
                </div>
                {knownSpells.length > 0 &&
                    <div style={{ marginTop: "0.75em" }}>
                        <div style={{ fontWeight: "bold", marginBottom: "0.5em", color: "#333" }}>Equip Spells:</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5em" }}>
                            {knownSpells.map(spell => (
                                <button
                                    key={spell}
                                    onClick={() => toggleEquip(spell)}
                                    style={{
                                        padding: "0.5em 1.2em",
                                        borderRadius: "8px",
                                        border: equipped.includes(spell) ? `2px solid ${theme.secondary}` : "1px solid #aaa",
                                        background: equipped.includes(spell) ? theme.secondary : "#f7f7f7",
                                        color: equipped.includes(spell) ? "#fff" : "#333",
                                        cursor: "pointer",
                                        fontWeight: equipped.includes(spell) ? "bold" : "normal",
                                        opacity: equipped.includes(spell) ? 1 : 0.8
                                    }}
                                    disabled={!equipped.includes(spell) && equipped.length >= MAX_EQUIPPED}
                                    title={equipped.includes(spell) ? "Unequip" : "Equip"}
                                >
                                    {spell}
                                </button>
                            ))}
                        </div>
                        <div style={{ fontSize: "0.80em", marginTop: "0.5em", color: "#666" }}>
                            Click to equip/unequip (max {MAX_EQUIPPED}).
                        </div>
                    </div>
                }
            </div>

            {/* Known Spells Listing */}
            <div>
                <strong>Unlocked Spells:</strong> {knownSpells.length > 0
                    ? knownSpells.join(", ")
                    : "None"
                }
            </div>
        </div>
    );
};

export default CharacterSheet;

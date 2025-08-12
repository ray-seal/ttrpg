import React, { useState } from "react";
import diceIcon from "../assets/dice.svg";

interface DiceButtonProps {
    allowedDice: number[]; 
}

const DiceButton: React.FC<DiceButtonProps> = ({ allowedDice }) => {
    const [showModal, setShowModal] = useState(false);
    const [rollResult, setRollResult] = useState<number | null>(null);

    function rollDice(sides: number) {
        const result = Math.floor(Math.random() * sides) + 1;
        setRollResult(result);
    }

    return (
        <>
        <button
        style={{
            position: "fixed",
            bottom:"2rem",
            right: "2rem",
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "#fff",
            border: "2px solid #ccc",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            zIndex: 1000,
            padding: 0,
            cursor: "pointer",
        }}
        onClick={() => setShowModal(true)}
        aria-label="Open dice roller"
        >
            <img src={diceIcon} alt="dice" style={{ width: "100%", height: "100%" }} />
            </button>
            {showModal && (
                <div
                style={{
                    position: "fixed",
                    bottom: "6rem",
                    right: "2rem",
                    background: "#fff",
                    border:"2px solid #ccc",
                    borderRadius: "12px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.18",
                    padding: "1rem",
                    zIndex: 1100,
                    minWidth: "160px",
                }}
                >
                    <div style={{ marginBottom: "0.75rem", fontWeight: "bold" }}>Roll Dice</div>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {allowedDice.map(sides => (
                            <button
                            key={sides}
                            style={{
                                background: "#e4e4e4",
                                border: "none",
                                borderRadius: "6px",
                                padding: "0.5rem 1rem",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                            onClick={() => rollDice(sides)}
                        >
                        d{sides}
                        </button>
                        ))}
                        </div>
                        {rollResult && (
                            <div style={{ marginTop: "1rem", fontSize: "1.5rem", color: "#333" }}>
                                <strong>{rollResult}</strong>
                            </div>
                        )}
                        <button
                        style={{
                            marginTop: "0.75rem",
                            background: "#ccc",
                            border: "none",
                            borderRadius: "6px",
                            padding: "0.25rem 0.75rem",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                        }}
                        onClick={() => {
                            setShowModal(false);
                            setRollResult(null);
                        }}
                        >
                            Close
                            </button>
                            </div>
                    )}
                    </>
                );
            };

            export default DiceButton;
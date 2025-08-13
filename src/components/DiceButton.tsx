import React, { useState, useEffect } from "react";
import diceIcon from "../assets/dice.svg";

interface DiceButtonProps {
    allowedDice: number[];
    showModal?: boolean;
    onRoll?: (result: number, sides: number) => void;
    onClose?: () => void;
}

const DiceButton: React.FC<DiceButtonProps> = ({
    allowedDice,
    showModal: showModalProp,
    onRoll,
    onClose,
}) => {
    const [showModalInternal, setShowModalInternal] = useState(false);
    const showModal = showModalProp !== undefined ? showModalProp : showModalInternal;
    const setShowModal = showModalProp !== undefined
        ? (open: boolean) => {
            if (!open && onClose) onClose();
        }
        : setShowModalInternal;

    const [rollResult, setRollResult] = useState<number | null>(null);

    function rollDice(sides: number) {
        const result = Math.floor(Math.random() * sides) + 1;
        setRollResult(result);
        if (onRoll) onRoll(result, sides);
    }

    // Reset roll result when modal opens
    useEffect(() => {
        if (showModal) setRollResult(null);
    }, [showModal]);

    return (
        <>
            <button
                style={{
                    position: "fixed",
                    bottom: "2rem",
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
                    display: showModalProp ? "none" : "block", // Hide when externally controlled
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
                        border: "2px solid #ccc",
                        borderRadius: "12px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
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
                    {rollResult !== null && (
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
                        onClick={() => setShowModal(false)}
                    >
                        Close
                    </button>
                </div>
            )}
        </>
    );
};

export default DiceButton;

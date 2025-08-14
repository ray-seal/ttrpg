import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Character } from "../types";
import DiceButton from "../components/DiceButton";

interface Props {
    character: Character;
    setCharacter: (char: Character) => void;
}

const WINGARDIUMLEVIOSA = "WingardiumLeviosa";

const WingardiumLeviosaLesson: React.FC<Props> = ({ character, setCharacter }) => {
    const [step, setStep] = useState(0);
    const [rollResult, setRollResult] = useState<number | null>(null);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [diceModalOpen, setDiceModalOpen] = useState(false);
    const navigate = useNavigate();

    function handleDiceRoll(result: number, sides: number) {
        if (sides !== 20) return; // Only allow d20
        const total = result + character.knowledge;
        setRollResult(total);
        if (total >= 12) {
            setSuccess(true);
            if (!character.unlockedSpells?.includes(WINGARDIUMLEVIOSA)) {
                setCharacter({
                    ...character,
                    unlockedSpells: [...(character.unlockedSpells ?? []), WINGARDIUMLEVIOSA],
                    experience: character.experience + 10,
                });
            }
        } else {
            setSuccess(false);
        }
        setStep(2);
        setDiceModalOpen(false);
    }

    function handleContinue() {
        navigate("/character-sheet");
    }

    return (
        <div style={{
            background: "#f4efe8",
            color: "#222",
            padding: "2rem",
            borderRadius: "16px",
            maxWidth: "500px",
            margin: "3rem auto",
            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            fontFamily: "serif",
            textAlign: "center",
            position: "relative"
        }}>
            <h2>Second Lesson: Wingardium Leviosa!</h2>
            {step === 0 && (
                <>
                    <p>
                        You enter Professor Flitwicks classroom to find feathers and pillows 
                        lining the desks. "Today students, we will be learning to make items float. 
                        Remember your swish and flick and say the spell Wingardium Leviosa!"
                        <br />
                        <strong>Your Task:</strong> Make the feather float and move the cusion into the basket!
                    </p>
                    <button
                        style={{
                            background: "#b7e4c7",
                            color: "#222",
                            padding: "1rem 2rem",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                            cursor: "pointer",
                            marginTop: "1.5rem"
                        }}
                        onClick={() => setStep(1)}
                    >Swish and Flick!</button>
                </>
            )}
            {step === 1 && (
                <>
                    <p>
                        <strong>Rolling d20 + Knowledge ({character.knowledge})...</strong>
                    </p>
                    <p>
                        Click the <span role="img" aria-label="dice">🎲</span> dice button in the corner to roll!
                    </p>
                    {/* This DiceButton is ONLY for lesson roll: only d20, controlled by showModal */}
                    <DiceButton
                        allowedDice={[20]}
                        showModal={diceModalOpen}
                        onRoll={handleDiceRoll}
                        onClose={() => setDiceModalOpen(false)}
                    />
                    {/* Overlay a transparent button over the dice icon to open for this lesson */}
                    <button
                        style={{
                            position: "fixed",
                            bottom: "2rem",
                            right: "2rem",
                            width: "64px",
                            height: "64px",
                            background: "transparent",
                            border: "none",
                            zIndex: 1500,
                            cursor: "pointer",
                        }}
                        aria-label="Open dice roller for lesson"
                        onClick={() => setDiceModalOpen(true)}
                        tabIndex={0}
                    />
                </>
            )}
            {step === 2 && (
                <>
                    <p>
                        <strong>Your roll:</strong> {rollResult}
                    </p>
                    {success ? (
                        <>
                            <p>
                                <span style={{ color: "#1b5e20", fontWeight: "bold" }}>Success!</span>
                                {" "}You recall "Alohomora" and the door unlocks. You learned the spell!
                            </p>
                            <button
                                style={{
                                    background: "#7B2D26",
                                    color: "#fff",
                                    padding: "1rem 2rem",
                                    borderRadius: "8px",
                                    fontWeight: "bold",
                                    fontSize: "1.1rem",
                                    cursor: "pointer",
                                    marginTop: "1.5rem"
                                }}
                                onClick={handleContinue}
                            >
                                Return to Character Sheet
                            </button>
                        </>
                    ) : (
                        <>
                            <p>
                                <span style={{ color: "#b71c1c", fontWeight: "bold" }}>Failure!</span>
                                {" "}You forget the spell. Try again next lesson.
                            </p>
                            <button
                                style={{
                                    background: "#4287f5",
                                    color: "#fff",
                                    padding: "1rem 2rem",
                                    borderRadius: "8px",
                                    fontWeight: "bold",
                                    fontSize: "1.1rem",
                                    cursor: "pointer",
                                    marginTop: "1.5rem"
                                }}
                                onClick={handleContinue}
                            >
                                Return to Character Sheet
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default WingardiumLeviosaLesson;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Character } from "../types";
import DiceButton from "../components/DiceButton";

interface Props {
    character: Character;
    setCharacter: (char: Character) => void;
}

const ALOHOMORA = "Alohomora";

const AlohomoraLesson: React.FC<Props> = ({ character, setCharacter }) => {
    const [step, setStep] = useState(0);
    const [rollResult, setRollResult] = useState<number | null>(null);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [diceModalOpen, setDiceModalOpen] = useState(false);
    const navigate = useNavigate();

    function handleDiceRoll(result: number, sides: number) {
        if (sides !== 20) return; // Only allow d20 rolls here
        const total = result + character.knowledge;
        setRollResult(total);
        if (total >= 12) {
            setSuccess(true);
            if (!character.unlockedSpells?.includes(ALOHOMORA)) {
                setCharacter({
                    ...character,
                    unlockedSpells: [...(character.unlockedSpells ?? []), ALOHOMORA],
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
            <h2>First Lesson: Alohomora!</h2>
            {step === 0 && (
                <>
                    <p>
                        Professor Flitwick leads you to a locked door. "Who can open it?" he asks.
                        <br />
                        <strong>Your Task:</strong> Remember the unlocking charm and pass a Knowledge check!
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
                    >Try to recall the spell!</button>
                </>
            )}
            {step === 1 && (
                <>
                    <p>
                        <strong>Rolling d20 + Knowledge ({character.knowledge})...</strong>
                    </p>
                    <button
                        style={{
                            background: "#d3c56b",
                            color: "#222",
                            padding: "1rem 2rem",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                            cursor: "pointer",
                            marginTop: "1.5rem"
                        }}
                        onClick={() => setDiceModalOpen(true)}
                    >Roll!</button>
                    {/* Only allow d20 for this lesson */}
                    <DiceButton
                        allowedDice={[20]}
                        showModal={diceModalOpen}
                        onRoll={handleDiceRoll}
                        onClose={() => setDiceModalOpen(false)}
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

export default AlohomoraLesson;

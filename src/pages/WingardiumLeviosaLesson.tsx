import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Character } from "../types";
import DiceButton from "../components/DiceButton";

interface Props {
    character: Character;
    setCharacter: (char: Character) => void;
}

const SPELLS = [
    "Alohomora",
    "Lumos",
    "Wingardium Leviosa",
    "Incendio",
    "Nox",
    "Finite Incantatem",
    "Expelliarmus"
];

const WINGARDIUM_LEVIOSA = "Wingardium Leviosa";

const WingardiumLeviosaLesson: React.FC<Props> = ({ character, setCharacter }) => {
    const [step, setStep] = useState(0);
    const [selectedSpell, setSelectedSpell] = useState<string | null>(null);
    const [wrongSpell, setWrongSpell] = useState(false);
    const [diceModalOpen, setDiceModalOpen] = useState(false);
    const [rollResult, setRollResult] = useState<number | null>(null);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [cushionRoll, setCushionRoll] = useState<number | null>(null);
    const [cushionSuccess, setCushionSuccess] = useState<boolean | null>(null);
    const [part, setPart] = useState<"feather" | "cushion">("feather");
    const navigate = useNavigate();

    // Step 0: Choose the spell
    function handleSpellSelect(spell: string) {
        setSelectedSpell(spell);
        if (spell === WINGARDIUM_LEVIOSA) {
            setWrongSpell(false);
            setStep(1);
        } else {
            setWrongSpell(true);
        }
    }

    // Step 1: Pick your die, roll for feather
    function handleFeatherRoll(result: number, sides: number) {
        const total = result + character.knowledge;
        setRollResult(total);
        if (total > 12) {
            setSuccess(true);
            setTimeout(() => {
                setPart("cushion");
                setStep(2);
                setRollResult(null);
                setSuccess(null);
            }, 900);
        } else {
            setSuccess(false);
        }
        setDiceModalOpen(false);
    }
    // Step 2: Pick your die, roll for cushion
    function handleCushionRoll(result: number, sides: number) {
        const total = result + character.knowledge;
        setCushionRoll(total);
        if (total > 15) {
            setCushionSuccess(true);
            // Unlock spell if not already unlocked
            if (!character.unlockedSpells?.includes(WINGARDIUM_LEVIOSA)) {
                setCharacter({
                    ...character,
                    unlockedSpells: [...(character.unlockedSpells ?? []), WINGARDIUM_LEVIOSA],
                    experience: character.experience + 10,
                });
            }
        } else {
            setCushionSuccess(false);
        }
        setDiceModalOpen(false);
    }

    function retryCushion() {
        setCushionRoll(null);
        setCushionSuccess(null);
    }

    function retryFeather() {
        setRollResult(null);
        setSuccess(null);
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
            maxWidth: "540px",
            margin: "3rem auto",
            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            fontFamily: "serif",
            textAlign: "center",
            position: "relative"
        }}>
            <h2>Second Lesson: Wingardium Leviosa!</h2>
            <div style={{
                background: "#ede7d3",
                borderRadius: "12px",
                padding: "1rem",
                marginBottom: "1.3rem",
                fontWeight: "bold",
                fontSize: "1.13em"
            }}>
                <span>Standard Book of Spells – Grade One</span>
            </div>
            {step === 0 && (
                <>
                    <p>
                        Professor Flitwick gestures to the board. "To make an object levitate, you must use the correct spell from your Standard Book of Spells. Which spell should you use to levitate the feather?"
                    </p>
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "1rem",
                        justifyContent: "center",
                        marginBottom: "1.1rem"
                    }}>
                        {SPELLS.map(spell => (
                            <button
                                key={spell}
                                style={{
                                    background: spell === WINGARDIUM_LEVIOSA ? "#7B2D26" : "#b7e4c7",
                                    color: spell === WINGARDIUM_LEVIOSA ? "#fff" : "#222",
                                    padding: "0.8rem 1.2rem",
                                    borderRadius: "8px",
                                    fontWeight: "bold",
                                    fontSize: "1.06rem",
                                    cursor: "pointer",
                                    border: "none",
                                    minWidth: "130px"
                                }}
                                onClick={() => handleSpellSelect(spell)}
                            >
                                {spell}
                            </button>
                        ))}
                    </div>
                    {wrongSpell && (
                        <div style={{
                            color: "#b71c1c",
                            marginTop: "1em",
                            fontWeight: "bold"
                        }}>
                            Professor Flitwick: "That's not quite right. Try again!"
                        </div>
                    )}
                </>
            )}
            {step === 1 && part === "feather" && (
                <>
                    <p>
                        <strong>Correct!</strong> Now, let's see if you can make the feather float.<br />
                        Roll any die (d4, d6, d8, d10, d12, d20) and add your Knowledge ({character.knowledge}).<br />
                    </p>
                    <DiceButton
                        allowedDice={[4, 6, 8, 10, 12, 20]}
                        showModal={diceModalOpen}
                        onRoll={handleFeatherRoll}
                        onClose={() => setDiceModalOpen(false)}
                    />
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
                    {rollResult !== null && (
                        <>
                            <p>
                                <strong>Your roll:</strong> {rollResult}
                            </p>
                            {success ? (
                                <div style={{ color: "#1b5e20", fontWeight: "bold" }}>
                                    Success! Your feather floats six inches above the desk.<br />
                                    Professor Flitwick beams: "Well done! Now try to move your cushion into the box."
                                </div>
                            ) : (
                                <>
                                    <div style={{ color: "#b71c1c", fontWeight: "bold" }}>
                                        You're saying it all wrong! It's leviOsa, not leviosAR. Try again!
                                    </div>
                                    <button
                                        style={{
                                            background: "#4287f5",
                                            color: "#fff",
                                            padding: "0.7rem 1.5rem",
                                            borderRadius: "8px",
                                            fontWeight: "bold",
                                            fontSize: "1.05rem",
                                            cursor: "pointer",
                                            marginTop: "1.1rem"
                                        }}
                                        onClick={retryFeather}
                                    >
                                        Try Again
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
            {step === 2 && part === "cushion" && (
                <>
                    <p>
                        <strong>Final Challenge:</strong> Move your cushion from the desk into the box using Wingardium Leviosa.<br />
                        Roll any die and add your Knowledge ({character.knowledge}).<br />
                    </p>
                    <DiceButton
                        allowedDice={[4, 6, 8, 10, 12, 20]}
                        showModal={diceModalOpen}
                        onRoll={handleCushionRoll}
                        onClose={() => setDiceModalOpen(false)}
                    />
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
                    {cushionRoll !== null && (
                        <>
                            <p>
                                <strong>Your roll:</strong> {cushionRoll}
                            </p>
                            {cushionSuccess ? (
                                <>
                                    <div style={{ color: "#1b5e20", fontWeight: "bold" }}>
                                        You did it! The cushion floats gently into the box.<br />
                                        Professor Flitwick claps: "Exceptional! You've mastered Wingardium Leviosa."
                                    </div>
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
                                    <div style={{ color: "#b71c1c", fontWeight: "bold" }}>
                                        Oh no! The cushion lands with a thud. Try again!
                                    </div>
                                    <button
                                        style={{
                                            background: "#4287f5",
                                            color: "#fff",
                                            padding: "0.7rem 1.5rem",
                                            borderRadius: "8px",
                                            fontWeight: "bold",
                                            fontSize: "1.05rem",
                                            cursor: "pointer",
                                            marginTop: "1.1rem"
                                        }}
                                        onClick={retryCushion}
                                    >
                                        Try Again
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default WingardiumLeviosaLesson;

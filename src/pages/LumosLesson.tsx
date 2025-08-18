import React, { useState, useEffect } from "react";
import DiceButton from "../components/DiceButton";

// ...maze and direction setup unchanged...

export default function LumosLesson({
  unlockedSpells = [],
  setCharacter,
  character = {},
}) {
  // Always allow Lumos in this lesson!
  const spells = Array.from(new Set([...(unlockedSpells || []), "Lumos"]));

  // Maze/game state
  const [maze, setMaze] = useState(() => generateMaze(GRID_SIZE));
  const [player, setPlayer] = useState({ x: 1, y: 1 });
  const [movement, setMovement] = useState(0);
  const [vision, setVision] = useState(INIT_VISION);
  const [lumosActive, setLumosActive] = useState(false);
  const [message, setMessage] = useState("");
  const [showSpellbook, setShowSpellbook] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showDice, setShowDice] = useState(false);
  const [showFlitwickSpeech, setShowFlitwickSpeech] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [path, setPath] = useState([[1, 1]]);

  useEffect(() => {
    setShowIntro(true);
  }, []);

  // Handle casting spells, unchanged...

  function tryMove(dx, dy) {
    if (movement <= 0) {
      setMessage("You need to roll the dice for more movement!");
      return;
    }
    const nx = player.x + dx;
    const ny = player.y + dy;
    if (maze[ny]?.[nx] === undefined || maze[ny][nx] === 1) {
      setMessage("You can't walk through walls!");
      return;
    }
    if (maze[ny][nx] === 2) {
      setMessage("A locked door blocks your way. Try casting Alohomora.");
      return;
    }
    if (maze[ny][nx] === 3) {
      setMessage("A heavy block blocks your way. Try casting Wingardium Leviosa.");
      return;
    }
    // Move player
    setPlayer({ x: nx, y: ny });
    setPath(prev => [...prev, [nx, ny]]);
    setMovement(movement - 1);
    setMessage("");
    // Check for win
    if (maze[ny][nx] === 4 && !hasCompleted) {
      setHasCompleted(true);
      setMessage("Congratulations! You've found the exit.");
      setTimeout(() => {
        setShowFlitwickSpeech(true);
      }, 1600);
    }
  }

  function handleDiceRoll(result) {
    setMovement(result);
    setMessage(`You rolled a ${result}. Move up to ${result} spaces.`);
    setShowDice(false);
  }

  // ...renderMaze, SpellbookModal, FlitwickIntro unchanged...

  function handleCloseSpeech() {
    setShowFlitwickSpeech(false);
    // Unlock Lumos and Nox in spellbook and as equippable
    if (setCharacter) {
      const unlocked = character.unlockedSpells || [];
      // Add both if not already present
      const next = Array.from(new Set([...unlocked, "Lumos", "Nox"]));
      setCharacter({ ...character, unlockedSpells: next });
    }
    // Optionally, call onComplete if you want to auto-advance
  }

  // Flitwick's Nox speech modal
  function FlitwickSpeech() {
    return (
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(255,250,220,0.98)",
          zIndex: 3000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.18em",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 440, background: "#fffbe9", border: "2px solid #d3c56b", padding: "2em", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}>
          <h2>Professor Flitwick</h2>
          <p>
            Brilliantly done! You found your way through the maze with the help of Lumos.<br /><br />
            <strong>But remember:</strong> when you no longer need your wand's light, the counter-charm is <b>Nox</b>.<br /><br />
            Now you know both <b>Lumos</b> (to light your wand) and <b>Nox</b> (to extinguish it). Both are now in your Spellbook and can be equipped for your adventures ahead.<br /><br />
            10 points to your house!
          </p>
          <button
            style={{
              marginTop: "1.5em",
              padding: "0.7em 1.6em",
              borderRadius: "8px",
              background: "#b7e4c7",
              color: "#333",
              border: "none",
              fontWeight: "bold",
              fontSize: "1.08em",
              cursor: "pointer"
            }}
            onClick={handleCloseSpeech}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: 28 * GRID_SIZE + 2,
        height: 28 * GRID_SIZE + 2,
        margin: "2rem auto",
        background: "#fffbe9",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.14)"
      }}
    >
      {showIntro && <FlitwickIntro />}
      {renderMaze()}
      {/* ...buttons & modals... */}
      <button
        style={{
          position: "fixed",
          left: 24,
          bottom: 24,
          zIndex: 1200,
          background: "#fff",
          border: "2px solid #d3c56b",
          borderRadius: "50%",
          width: 60,
          height: 60,
          fontWeight: "bold",
          fontSize: "1.5em",
          boxShadow: "0 2px 10px rgba(0,0,0,0.10)"
        }}
        onClick={() => setShowSpellbook(true)}
        aria-label="Open spellbook"
      >
        📖
      </button>
      {showSpellbook && <SpellbookModal />}
      <button
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 1200,
          background: "#fff",
          border: "2px solid #d3c56b",
          borderRadius: "50%",
          width: 60,
          height: 60,
          fontWeight: "bold",
          fontSize: "1.5em",
          boxShadow: "0 2px 10px rgba(0,0,0,0.10)"
        }}
        onClick={() => setShowDice(true)}
        aria-label="Roll dice"
      >
        🎲
      </button>
      {showDice && (
        <DiceButton
          allowedDice={[6]}
          showModal={true}
          onRoll={handleDiceRoll}
          onClose={() => setShowDice(false)}
        />
      )}
      {showFlitwickSpeech && <FlitwickSpeech />}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import DiceButton from "../components/DiceButton";

// Maze generation and helpers
const GRID_SIZE = 12;
const INIT_VISION = 1;
const LUMOS_VISION = 3;

const directions = [
  { dx: 0, dy: -1, name: "Up" },
  { dx: 1, dy: 0, name: "Right" },
  { dx: 0, dy: 1, name: "Down" },
  { dx: -1, dy: 0, name: "Left" },
];

function generateMaze(size, numObstacles = 25, numDoors = 3, numBlocks = 3) {
  // 0 = empty, 1 = wall, 2 = locked door, 3 = heavy block, 4 = exit
  const maze = Array.from({ length: size }, () =>
    Array(size).fill(0)
  );
  // Border walls
  for (let i = 0; i < size; i++) {
    maze[0][i] = 1;
    maze[size - 1][i] = 1;
    maze[i][0] = 1;
    maze[i][size - 1] = 1;
  }
  // Add random walls
  let placed = 0;
  while (placed < numObstacles) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    if (maze[y][x] === 0 && !(x === 1 && y === 1)) {
      maze[y][x] = 1;
      placed++;
    }
  }
  // Add locked doors
  placed = 0;
  while (placed < numDoors) {
    const x = Math.floor(Math.random() * (size - 2)) + 1;
    const y = Math.floor(Math.random() * (size - 2)) + 1;
    if (maze[y][x] === 0) {
      maze[y][x] = 2; // Locked door
      placed++;
    }
  }
  // Add heavy blocks
  placed = 0;
  while (placed < numBlocks) {
    const x = Math.floor(Math.random() * (size - 2)) + 1;
    const y = Math.floor(Math.random() * (size - 2)) + 1;
    if (maze[y][x] === 0) {
      maze[y][x] = 3;
      placed++;
    }
  }
  // Set exit (bottom right-ish)
  maze[size - 2][size - 2] = 4;
  return maze;
}

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

  function handleCastSpell(spell) {
    if (spell === "Lumos") {
      setLumosActive(true);
      setVision(LUMOS_VISION);
      setMessage("You cast Lumos! You can see further ahead.");
    } else if (spell === "Alohomora") {
      // Unlock door at adjacent tile if found
      let unlocked = false;
      for (let dir of directions) {
        const nx = player.x + dir.dx;
        const ny = player.y + dir.dy;
        if (maze[ny]?.[nx] === 2) {
          const newMaze = maze.map(row => [...row]);
          newMaze[ny][nx] = 0;
          setMaze(newMaze);
          setMessage("You cast Alohomora and unlock the door!");
          unlocked = true;
          break;
        }
      }
      if (!unlocked) setMessage("No locked door adjacent to use Alohomora!");
    } else if (spell === "Wingardium Leviosa") {
      // Move block at adjacent tile if found
      let moved = false;
      for (let dir of directions) {
        const nx = player.x + dir.dx;
        const ny = player.y + dir.dy;
        if (maze[ny]?.[nx] === 3) {
          const newMaze = maze.map(row => [...row]);
          newMaze[ny][nx] = 0;
          setMaze(newMaze);
          setMessage("You cast Wingardium Leviosa and move the heavy block!");
          moved = true;
          break;
        }
      }
      if (!moved) setMessage("No heavy block adjacent to use Wingardium Leviosa!");
    }
    setShowSpellbook(false);
  }

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

  // Render maze grid with vision mask
  function renderMaze() {
    let tiles = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        // Vision mask
        const dist =
          Math.abs(x - player.x) + Math.abs(y - player.y);
        let visible = dist <= vision;
        let isPlayer = x === player.x && y === player.y;
        let isExit = maze[y][x] === 4;
        let color = "#f9f9f9";
        if (!visible) color = "#222";
        else if (isPlayer) color = "red";
        else if (maze[y][x] === 1) color = "#444";
        else if (maze[y][x] === 2) color = "#5bc0eb";
        else if (maze[y][x] === 3) color = "#f7b32b";
        else if (isExit) color = "#4ecdc4";
        else if (visible && dist > 0 && dist <= vision) color = "#b6edb6";
        tiles.push(
          <div
            key={x + "," + y}
            style={{
              width: 28,
              height: 28,
              background: color,
              border: "1px solid #ccc",
              boxSizing: "border-box",
              display: "inline-block",
              position: "relative",
            }}
          ></div>
        );
      }
    }
    return (
      <div
        style={{
          width: 28 * GRID_SIZE,
          height: 28 * GRID_SIZE,
          display: "flex",
          flexWrap: "wrap",
          border: "2px solid #444",
          background: "#222"
        }}
      >
        {tiles}
      </div>
    );
  }

  // Spellbook modal
  function SpellbookModal() {
    return (
      <div
        style={{
          position: "fixed",
          left: 24,
          bottom: 90,
          background: "#fffbe9",
          border: "2px solid #d3c56b",
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.14)",
          padding: "1em",
          zIndex: 1001,
          minWidth: 200,
        }}
      >
        <h4>Spellbook</h4>
        {["Lumos", "Alohomora", "Wingardium Leviosa"].map((spell) =>
          spells.includes(spell) ? (
            <button
              key={spell}
              style={{
                margin: "0.5em",
                background: "#eee",
                borderRadius: 6,
                padding: "0.5em 1em",
                border: "1px solid #ccc",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => handleCastSpell(spell)}
            >
              {spell}
            </button>
          ) : (
            <span
              key={spell}
              style={{
                margin: "0.5em",
                color: "#bbb",
                textDecoration: "line-through"
              }}
            >
              {spell}
            </span>
          )
        )}
        <div>
          <button
            style={{
              margin: "0.5em 0 0 0",
              background: "#ccc",
              borderRadius: 5,
              padding: "0.4em 1em",
              border: "none",
            }}
            onClick={() => setShowSpellbook(false)}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Flitwick's Intro
  function FlitwickIntro() {
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          background: "rgba(255,250,220,0.98)",
          zIndex: 2000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.18em",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 400, background: "#fffbe9", border: "2px solid #d3c56b", padding: "2em", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}>
          <h2>Professor Flitwick</h2>
          <p>
            Welcome to your Lumos Lesson!<br /><br />
            In this maze, you must find your way out using the <b>Lumos</b> spell to light your path.<br />
            Roll a <b>d6</b> to move up to that many spaces, in any direction you wish. Use your unlocked spells:
            <ul style={{ textAlign: "left", margin: "1em auto", maxWidth: 300 }}>
              <li><b>Lumos</b> to see further ahead</li>
              <li><b>Alohomora</b> to unlock doors</li>
              <li><b>Wingardium Leviosa</b> to move heavy blocks</li>
            </ul>
            Click the spellbook in the corner to cast them.<br /><br />
            Good luck!
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
            onClick={() => setShowIntro(false)}
          >
            Begin Lesson
          </button>
        </div>
      </div>
    );
  }

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
        height: 28 * GRID_SIZE + 122, // +122px for controls at the bottom
        margin: "2rem auto",
        background: "#fffbe9",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.14)",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Flitwick intro overlay */}
      {showIntro && <FlitwickIntro />}
      {/* Maze grid */}
      <div style={{ flex: "0 0 auto" }}>{renderMaze()}</div>
      {/* Controls and message at bottom center */}
      <div
        style={{
          width: 28 * GRID_SIZE,
          margin: "0 auto",
          paddingTop: 10,
          paddingBottom: 18,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "absolute",
          left: "50%",
          transform: `translateX(-50%)`,
          bottom: 0,
          zIndex: 101,
          background: "transparent"
        }}
      >
        {message && (
          <div
            style={{
              background: "#fffbe9",
              borderRadius: 8,
              border: "1px solid #d3c56b",
              padding: "0.6em 1.1em",
              fontWeight: "bold",
              minWidth: 120,
              marginBottom: "0.8em",
              textAlign: "center"
            }}
          >
            {message}
          </div>
        )}
        <div style={{ marginBottom: "0.5em" }}>
          Movement left: <b>{movement}</b>
        </div>
        <div>
          {directions.map((dir, i) =>
            <button
              key={dir.name}
              disabled={movement <= 0}
              style={{
                margin: "0.2em",
                padding: "0.5em 1em",
                borderRadius: 6,
                border: "1px solid #ccc",
                background: movement > 0 ? "#e4e4e4" : "#eee",
                fontWeight: "bold",
                cursor: movement > 0 ? "pointer" : "default",
              }}
              onClick={() => tryMove(dir.dx, dir.dy)}
            >
              {dir.name}
            </button>
          )}
        </div>
      </div>
      {/* Spellbook button */}
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
      {/* Dice roller floating button (opens modal) */}
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

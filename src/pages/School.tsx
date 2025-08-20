import React from "react";
import { Character } from "../types";

const School: React.FC<{
  character: Character;
  setCharacter: (c: Character) => void;
}> = ({ character }) => {
  return (
    <div style={{
      maxWidth: 700,
      margin: "2rem auto",
      padding: "2.5rem",
      background: "#f5efd9",
      borderRadius: 14,
      fontFamily: "serif",
      color: "#432c15",
      border: "2px solid #b79b5a",
    }}>
      <h2 style={{
        fontFamily: "cursive",
        textAlign: "center",
        marginBottom: "1.8rem",
        color: "#1e1c17"
      }}>
        Hogwarts School
      </h2>
      <p>
        Welcome to Hogwarts, {character.name}! Your magical education begins here. Attend classes, meet professors, make friends, and discover secrets hidden within the castle's ancient walls.
      </p>
      <ul style={{ marginTop: "1.5rem" }}>
        <li>Explore the castle and grounds</li>
        <li>Attend magical lessons</li>
        <li>Complete quests and earn house points</li>
        <li>Unlock new spells and abilities</li>
      </ul>
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <span role="img" aria-label="castle" style={{ fontSize: "2.5rem" }}>🏰</span>
      </div>
    </div>
  );
};

export default School;

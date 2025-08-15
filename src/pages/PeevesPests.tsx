import React from "react";
import { Link } from "react-router-dom";
import { Character } from "../types";
import { houseThemes } from "../themes";

interface Props {
  character: Character;
}

const PeevesPests: React.FC<Props> = ({ character }) => {
  const theme = houseThemes[character.house];
  return (
    <div
      style={{
        background: theme.background,
        color: theme.primary,
        border: `2px solid ${theme.secondary}`,
        padding: "2rem",
        borderRadius: "16px",
        maxWidth: "540px",
        margin: "3rem auto",
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        fontFamily: "serif",
        textAlign: "center",
        opacity: 0.6
      }}
    >
      <Link
        to="/school"
        style={{
          display: "inline-block",
          marginBottom: "1.2rem",
          background: "#af1e8c",
          color: "#fff",
          padding: "0.7rem 1.3rem",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "1rem",
        }}
      >
        Back to School
      </Link>
      <h2 style={{ color: "#af1e8c" }}>Peeves' Pests</h2>
      <div style={{
        margin: "1.5rem 0 0 0",
        fontSize: "1.2em"
      }}>
        <p>
          Welcome to Peeves' secret club! Here you’ll find side quests all about causing magical mayhem across Hogwarts.
        </p>
        <p style={{ fontStyle: "italic", color: "#af1e8c" }}>
          (Side quests coming soon!)
        </p>
      </div>
    </div>
  );
};

export default PeevesPests;

import React from "react";
import { Character } from "../types";
import ThemedLayout from "../components/ThemedLayout";
import { houseThemes, House } from "../themes";
import { Link, useNavigate } from "react-router-dom";

const navItemStyle = (theme) => ({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  padding: "1.1em 1.4em",
  margin: "0.7em 0",
  background: "#fff",
  borderRadius: 12,
  border: `2px solid ${theme.accent}`,
  color: theme.primary,
  fontWeight: 650,
  fontSize: "1.15rem",
  textDecoration: "none",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  transition: "background 0.2s, color 0.2s, border 0.2s",
});

const comingSoonStyle = (theme) => ({
  ...navItemStyle(theme),
  background: "#f4f4f4",
  color: theme.secondary,
  cursor: "not-allowed",
  opacity: 0.7,
  borderStyle: "dashed",
  textDecoration: "none",
});

const School: React.FC<{
  character: Character;
  setCharacter: (c: Character) => void;
}> = ({ character }) => {
  const theme = houseThemes[character.house as House];
  const navigate = useNavigate();

  // Lowercase for URL, fallback if needed
  const housePath = character.house ? character.house.toLowerCase() : "";

  return (
    <ThemedLayout character={character}>
      <h2 style={{
        fontFamily: "cursive",
        textAlign: "center",
        marginBottom: "1.6rem",
        color: theme.accent,
        textShadow: "0 3px 8px rgba(0,0,0,0.10)",
        letterSpacing: "1.5px"
      }}>
        Hogwarts School
      </h2>
      <p style={{
        color: theme.primary,
        fontWeight: 600,
        fontSize: "1.13rem",
        background: "#fff",
        borderRadius: 8,
        padding: "0.6em 1em",
        margin: "0 auto 1.5em auto",
        maxWidth: 600,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        fontFamily: "'Georgia', 'serif'"
      }}>
        Welcome to Hogwarts, {character.name}! Navigate the castle, attend magical classes, socialize in your common room, and more.
      </p>

      <nav style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        maxWidth: 400,
        margin: "2.5rem auto 2rem auto",
        gap: "0.5rem",
      }}>
        <Link to="/school/classes" style={navItemStyle(theme)}>
          <span role="img" aria-label="books">📚</span> Classes
        </Link>
        <Link to={`/commonrooms/${housePath}`} style={navItemStyle(theme)}>
          <span role="img" aria-label="common room">🛋️</span> {character.house} Common Room
        </Link>
        <span style={comingSoonStyle(theme)}>
          <span role="img" aria-label="hall">🏰</span> Great Hall (coming soon)
        </span>
        <span style={comingSoonStyle(theme)}>
          <span role="img" aria-label="owlery">🦉</span> Owlery (coming soon)
        </span>
        <span style={comingSoonStyle(theme)}>
          <span role="img" aria-label="library">📖</span> Library (coming soon)
        </span>
        <span style={comingSoonStyle(theme)}>
          <span role="img" aria-label="hogsmeade">🏘️</span> Hogsmeade (coming soon)
        </span>
      </nav>

      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: theme.accent,
            color: theme.primary,
            padding: "0.8rem 2rem",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
            transition: "background 0.2s",
            boxShadow: "0 2px 8px #fff"
          }}
        >
          Back to Home
        </button>
      </div>
    </ThemedLayout>
  );
};

export default School;

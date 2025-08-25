import React from "react";
import { Character } from "../types";
import ThemedLayout from "../components/ThemedLayout";
import { houseThemes, House } from "../themes";
import { Link } from "react-router-dom";

const subjectStyle = (theme) => ({
  background: "#fff",
  border: `2px solid ${theme.accent}`,
  borderRadius: 10,
  margin: "1.5em 0",
  padding: "1.5em",
  boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
  color: theme.primary,
});

export default function Classes({ character }: { character: Character }) {
  const theme = houseThemes[character.house as House];

  return (
    <ThemedLayout character={character}>
      <h2 style={{
        fontFamily: "cursive",
        textAlign: "center",
        color: theme.accent,
        marginBottom: "1.4rem",
        letterSpacing: "1.5px",
      }}>
        Your Classes at Hogwarts
      </h2>
      <p style={{
        color: theme.primary,
        fontWeight: 600,
        fontSize: "1.1rem",
        background: "#fff",
        borderRadius: 8,
        padding: "0.6em 1em",
        margin: "0 auto 1.5em auto",
        maxWidth: 600,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        fontFamily: "'Georgia', 'serif'",
      }}>
        Browse your available and upcoming lessons, sorted by year and subject.
      </p>
      <h3 style={{ color: theme.secondary, marginTop: "2rem", marginBottom: "0.5rem" }}>Year 1</h3>

      {/* Charms */}
      <div style={subjectStyle(theme)}>
        <h4 style={{ color: theme.accent, marginBottom: 8 }}>Charms</h4>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>
            <Link to="/wingardium-leviosa-lesson" style={{ color: theme.accent, fontWeight: "bold" }}>
              Wingardium Leviosa
            </Link>
          </li>
          <li>
            <Link to="/alohomora-lesson" style={{ color: theme.accent, fontWeight: "bold" }}>
              Alohomora
            </Link>
          </li>
          <li>
            <Link to="/lumos-lesson" style={{ color: theme.accent, fontWeight: "bold" }}>
              Lumos
            </Link>
          </li>
        </ul>
      </div>

      {/* Potions */}
      <div style={subjectStyle(theme)}>
        <h4 style={{ color: theme.accent, marginBottom: 8 }}>Potions</h4>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li style={{ color: theme.secondary, opacity: 0.6 }}>
            Intro to Potions (coming soon)
          </li>
        </ul>
      </div>

      {/* Defence Against the Dark Arts */}
      <div style={subjectStyle(theme)}>
        <h4 style={{ color: theme.accent, marginBottom: 8 }}>Defence Against the Dark Arts</h4>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li style={{ color: theme.secondary, opacity: 0.6 }}>
            Introduction to Defensive Spells (coming soon)
          </li>
        </ul>
      </div>

      {/* Add more years/subjects as needed */}
    </ThemedLayout>
  );
}

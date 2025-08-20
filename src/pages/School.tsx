import React from "react";
import { Character } from "../types";
import ThemedLayout from "../components/ThemedLayout";
import { houseThemes, House } from "../themes";
import { Link, useNavigate } from "react-router-dom";

const School: React.FC<{
  character: Character;
  setCharacter: (c: Character) => void;
}> = ({ character }) => {
  const theme = houseThemes[character.house as House];
  const navigate = useNavigate();

  const timetable = [
    { day: "Monday", lesson: "Charms: Wingardium Leviosa" },
    { day: "Tuesday", lesson: "Charms: Alohomora" },
    { day: "Wednesday", lesson: "Charms: Lumos" },
    { day: "Thursday", lesson: "Potions (coming soon)" },
    { day: "Friday", lesson: "Transfiguration (coming soon)" },
  ];

  return (
    <ThemedLayout character={character}>
      <h2 style={{
        fontFamily: "cursive",
        textAlign: "center",
        marginBottom: "1.8rem",
        color: "#000",
        textShadow: "0 3px 8px rgba(255,255,255,0.15)"
      }}>
        Hogwarts School
      </h2>
      <p style={{
        color: "#000",
        fontWeight: 600,
        fontSize: "1.15rem",
        background: "#fff",
        borderRadius: 8,
        padding: "0.6em 1em",
        marginBottom: "1.2em",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
      }}>
        Welcome to Hogwarts, {character.name}! Your magical education begins here. Attend classes, meet professors, make friends, and discover secrets hidden within the castle's ancient walls.
      </p>

      <h3 style={{
        marginTop: "2rem",
        marginBottom: "0.7rem",
        color: "#000",
        textShadow: "0 2px 5px #fff"
      }}>Key Locations</h3>
      <ul style={{ fontWeight: 500, color: "#000" }}>
        <li>
          <b>Owlery</b> <span style={{ color: theme.accent }}>(coming soon)</span>
        </li>
        <li>
          <b>Common Room</b> <span style={{ color: theme.accent }}>(coming soon)</span>
        </li>
        <li>
          <b>Great Hall</b> <span style={{ color: theme.accent }}>(coming soon)</span>
        </li>
      </ul>

      <h3 style={{
        marginTop: "2rem",
        marginBottom: "0.7rem",
        color: "#000",
        textShadow: "0 2px 5px #fff"
      }}>Your Timetable</h3>
      <ul style={{ background: "#fff", borderRadius: 8, padding: "0.8em 1.2em", color: "#000" }}>
        {timetable.map((entry, i) => (
          <li key={i} style={{ margin: "0.3em 0" }}>
            <b>{entry.day}: </b>
            {entry.lesson}
          </li>
        ))}
      </ul>

      <h3 style={{
        marginTop: "2rem",
        marginBottom: "0.7rem",
        color: "#000",
        textShadow: "0 2px 5px #fff"
      }}>Classes</h3>
      <ul>
        <li>
          <b>Charms</b>
          <ul style={{ marginTop: "0.5rem" }}>
            <li>
              <Link to="/wingardium-leviosa-lesson" style={{
                color: theme.accent,
                textDecoration: "underline",
                fontWeight: "bold",
                background: "#fff",
                borderRadius: 4,
                padding: "0.1em 0.5em"
              }}>
                Wingardium Leviosa
              </Link>
            </li>
            <li>
              <Link to="/alohomora-lesson" style={{
                color: theme.accent,
                textDecoration: "underline",
                fontWeight: "bold",
                background: "#fff",
                borderRadius: 4,
                padding: "0.1em 0.5em"
              }}>
                Alohomora
              </Link>
            </li>
            <li>
              <Link to="/lumos-lesson" style={{
                color: theme.accent,
                textDecoration: "underline",
                fontWeight: "bold",
                background: "#fff",
                borderRadius: 4,
                padding: "0.1em 0.5em"
              }}>
                Lumos
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <b>Transfiguration</b> <span style={{ color: theme.accent }}>(coming soon)</span>
        </li>
        <li>
          <b>Potions</b> <span style={{ color: theme.accent }}>(coming soon)</span>
        </li>
        <li>
          <b>Defence Against the Dark Arts</b> <span style={{ color: theme.accent }}>(coming soon)</span>
        </li>
        <li>
          <b>Herbology</b> <span style={{ color: theme.accent }}>(coming soon)</span>
        </li>
        <li>
          <b>Care of Magical Creatures</b> <span style={{ color: theme.accent }}>(coming soon)</span>
        </li>
      </ul>

      <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: theme.accent,
            color: "#000",
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
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <span role="img" aria-label="castle" style={{ fontSize: "2.5rem" }}>🏰</span>
      </div>
    </ThemedLayout>
  );
};

export default School;

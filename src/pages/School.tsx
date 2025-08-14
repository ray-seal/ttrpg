import React from "react";
import { Link } from "react-router-dom";
import { Character } from "../types";
import { houseThemes } from "../themes";

const yearOneLessons = [
  {
    title: "Alohomora",
    path: "/school/alohomora-lesson",
    desc: "Unlocking Charm",
  },
  {
    title: "Lumos",
    path: "#",
    desc: "Wand-Lighting Charm",
  },
  {
    title: "Wingardium Leviosa",
    path: "/school/wingardium-leviosa-lesson",
    desc: "Levitation Charm",
  },
  {
    title: "Petrificus Totalus",
    path: "#",
    desc: "Full Body-Bind Curse",
  },
  {
    title: "Incendio",
    path: "#",
    desc: "Fire-Making Spell",
  },
  {
    title: "Nox",
    path: "#",
    desc: "Wand-Extinguishing Charm",
  },
  {
    title: "Finite Incantatem",
    path: "#",
    desc: "General Counter-Spell",
  },
  {
    title: "Expelliarmus",
    path: "#",
    desc: "Disarming Charm",
  },
  {
    title: "Devil's Snare Escape",
    path: "#",
    desc: "Plant-repelling technique",
  },
  {
    title: "Obliviate",
    path: "#",
    desc: "Memory Charm",
  },
  {
    title: "Locomotor Mortis",
    path: "#",
    desc: "Leg-Locker Curse",
  },
  {
    title: "Ennervate",
    path: "#",
    desc: "Reviving Spell",
  },
];

interface Props {
  character: Character;
}

const School: React.FC<Props> = ({ character }) => {
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
      }}
    >
      <Link
        to="/"
        style={{
          display: "inline-block",
          marginBottom: "1.2rem",
          background: theme.secondary,
          color: "#fff",
          padding: "0.7rem 1.3rem",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "1rem",
        }}
      >
        Back to Home
      </Link>
      <h2>Hogwarts School Lessons</h2>
      <div style={{
        padding: "1.6rem",
        background: "#ece6da",
        borderRadius: "12px",
        margin: "2rem 0",
        boxShadow: "0 2px 6px rgba(0,0,0,0.07)",
      }}>
        <h3 style={{ marginBottom: "1.1rem", color: theme.secondary }}>Year 1</h3>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1rem",
        }}>
          {yearOneLessons.map(lesson => (
            lesson.path !== "#" ? (
              <Link
                key={lesson.title}
                to={lesson.path}
                style={{
                  background: theme.primary,
                  color: "#fff",
                  padding: "1rem 1.4rem",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  textDecoration: "none",
                  minWidth: "175px",
                  marginBottom: "0.5rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                  transition: "background .15s",
                }}
              >
                {lesson.title}
                <div style={{
                  fontWeight: "normal",
                  fontSize: "0.95em",
                  marginTop: "0.3em",
                  color: theme.accent
                }}>
                  {lesson.desc}
                </div>
              </Link>
            ) : (
              <button
                key={lesson.title}
                disabled
                style={{
                  background: theme.accent,
                  color: "#fff",
                  padding: "1rem 1.4rem",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  minWidth: "175px",
                  marginBottom: "0.5rem",
                  border: "none",
                  opacity: 0.7,
                  cursor: "not-allowed",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                }}
              >
                {lesson.title}
                <div style={{
                  fontWeight: "normal",
                  fontSize: "0.95em",
                  marginTop: "0.3em",
                  color: theme.secondary
                }}>
                  {lesson.desc}
                </div>
              </button>
            )
          ))}
        </div>
        <div style={{
          marginTop: "1.4rem",
          color: theme.secondary,
          fontSize: "0.95em"
        }}>
          (More years coming soon!)
        </div>
      </div>
    </div>
  );
};

export default School;

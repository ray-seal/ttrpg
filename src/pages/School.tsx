import React from "react";
import { Link } from "react-router-dom";
import { Character } from "../types";
import { houseThemes } from "../themes";

const yearOneLessons = [
  {
    title: "Alohomora",
    path: "/school/alohomora-lesson",
    desc: "Unlocking Charm",
    required: null, // always available
  },
  {
    title: "Lumos",
    path: "#",
    desc: "Wand-Lighting Charm",
    required: null,
  },
  {
    title: "Wingardium Leviosa",
    path: "/school/wingardium-leviosa-lesson",
    desc: "Levitation Charm",
    required: "Alohomora", // must finish Alohomora first!
  },
  {
    title: "Petrificus Totalus",
    path: "#",
    desc: "Full Body-Bind Curse",
    required: null,
  },
  {
    title: "Incendio",
    path: "#",
    desc: "Fire-Making Spell",
    required: null,
  },
  {
    title: "Nox",
    path: "#",
    desc: "Wand-Extinguishing Charm",
    required: null,
  },
  {
    title: "Finite Incantatem",
    path: "#",
    desc: "General Counter-Spell",
    required: null,
  },
  {
    title: "Expelliarmus",
    path: "#",
    desc: "Disarming Charm",
    required: null,
  },
  {
    title: "Devil's Snare Escape",
    path: "#",
    desc: "Plant-repelling technique",
    required: null,
  },
  {
    title: "Obliviate",
    path: "#",
    desc: "Memory Charm",
    required: null,
  },
  {
    title: "Locomotor Mortis",
    path: "#",
    desc: "Leg-Locker Curse",
    required: null,
  },
  {
    title: "Ennervate",
    path: "#",
    desc: "Reviving Spell",
    required: null,
  },
];

interface Props {
  character: Character;
}

const School: React.FC<Props> = ({ character }) => {
  const theme = houseThemes[character.house];
  const completedLessons = character.completedLessons || [];
  // Accept either a flag or a direct property for Peeves Pests unlock
  const peevesUnlocked = !!character.unlockedPeevesPests || !!(character.flags && character.flags.peevesPest);

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
          {yearOneLessons.map(lesson => {
            // Is this lesson locked?
            const isLocked = lesson.required && !completedLessons.includes(lesson.required);
            if (lesson.path !== "#") {
              return isLocked ? (
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
                  title={`Complete ${lesson.required} to unlock`}
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
              ) : (
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
              );
            } else {
              return (
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
              );
            }
          })}
        </div>
        <div style={{
          marginTop: "1.4rem",
          color: theme.secondary,
          fontSize: "0.95em"
        }}>
          (More years coming soon!)
        </div>
      </div>
      {peevesUnlocked && (
        <Link
          to="/peeves-pests"
          style={{
            display: "inline-block",
            marginTop: "1.5rem",
            background: "#af1e8c",
            color: "#fff",
            padding: "1rem 2rem",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "1.15rem",
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            letterSpacing: "0.04em"
          }}
        >
          🧨 Peeves Pests Side Quests
        </Link>
      )}
    </div>
  );
};

export default School;

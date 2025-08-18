import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Character } from "../types";
import { houseThemes } from "../themes";

interface Props {
  character: Character;
}

const yearOneLessons = [
  {
    title: "Alohomora",
    path: "/school/alohomora-lesson",
    desc: "Unlocking Charm",
    required: null,
  },
  {
    title: "Lumos/Nox",
    path: "/school/lumos-lesson",
    desc: "Wand-Lighting & -Dousing Charm",
    required: null, // gating handled below
  },
  {
    title: "Wingardium Leviosa",
    path: "/school/wingardium-leviosa-lesson",
    desc: "Levitation Charm",
    required: "Alohomora",
  },
  {
    title: "Incendio",
    path: "#",
    desc: "Fire-Making Spell",
    required: null,
  },
];

const School: React.FC<Props> = ({ character }) => {
  const theme = houseThemes[character.house];
  const completedLessons = character.completedLessons || [];
  const peevesUnlocked =
    !!character.unlockedPeevesPests ||
    !!(character.flags && character.flags.peevesPest);
  const navigate = useNavigate();
  const hasDetention = !!(character.flags && character.flags.detention);

  // Only unlocked after 'school_termtwo' flag is set
  const hasUnlockedLumos = !!(character.flags && character.flags.school_termtwo);

  if (hasDetention) {
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
          position: "relative",
        }}
      >
        <h2 style={{ color: theme.secondary }}>You Have Detention</h2>
        <p style={{ marginBottom: "2em" }}>
          Professor Snape has assigned you to clean cauldrons by hand. You must complete your detention before attending classes.
        </p>
        <button
          onClick={() => navigate("/detentions")}
          style={{
            background: theme.secondary,
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "0.8em 1.8em",
            fontWeight: "bold",
            fontSize: "1.1em",
            cursor: "pointer",
            marginTop: "1em"
          }}
        >
          Go To Detention
        </button>
      </div>
    );
  }

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
        opacity: 0.6,
        position: "relative",
      }}
    >
      {peevesUnlocked && (
        <button
          onClick={() => navigate("/peeves-pests")}
          style={{
            position: "fixed",
            top: "2rem",
            left: "2rem",
            background: "#af1e8c",
            color: "#fff",
            padding: "0.7rem 1.5rem",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "1.05rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            border: "none",
            zIndex: 3001,
            cursor: "pointer",
            letterSpacing: "0.04em",
            transition: "background .15s",
          }}
          aria-label="Peeves Pests"
        >
          🧨 Peeves Pests
        </button>
      )}

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
        <h3 style={{ marginBottom: "1.1rem", color: theme.secondary }}>Year 1 (Standard Book of Spells, Grade 1)</h3>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1rem",
        }}>
          {yearOneLessons.map(lesson => {
            // Custom lock for Lumos/Nox
            const isLumos = lesson.title === "Lumos/Nox";
            const isLocked = isLumos
              ? !hasUnlockedLumos
              : lesson.required && !completedLessons.includes(lesson.required);

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
                  title={
                    isLumos
                      ? "Unlocked after completing the troll quest (term two)"
                      : `Complete ${lesson.required} to unlock`
                  }
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
    </div>
  );
};

export default School;

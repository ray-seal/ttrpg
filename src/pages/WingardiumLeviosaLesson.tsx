import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Character } from "../types";
import { houseThemes } from "../themes";

interface Props {
  character: Character;
  setCharacter: (c: Character) => void;
}

const WingardiumLeviosaLesson: React.FC<Props> = ({ character, setCharacter }) => {
  const theme = houseThemes[character.house];
  const [completed, setCompleted] = useState(
    (character.completedLessons || []).includes("Wingardium Leviosa")
  );
  const navigate = useNavigate();

  function handleComplete() {
    if (!completed) {
      setCompleted(true);
      setCharacter({
        ...character,
        completedLessons: [
          ...(character.completedLessons || []),
          "Wingardium Leviosa"
        ],
      });
    }
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
      }}
    >
      <Link
        to="/school"
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
        Back to School
      </Link>
      <h2>Wingardium Leviosa Lesson</h2>
      {!completed ? (
        <>
          <div style={{ margin: "2rem 0", fontSize: "1.15em" }}>
            <p>
              Welcome to your Levitation Charm lesson! Today, you'll learn <b>Wingardium Leviosa</b>.
            </p>
            <p>
              Practice the wand movement: <i>swish and flick</i>. Say the incantation clearly: <b>Wingardium Leviosa!</b>
            </p>
          </div>
          <button
            style={{
              background: theme.primary,
              color: "#fff",
              padding: "1rem 1.5rem",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              border: "none",
              cursor: "pointer",
              marginBottom: "1.5rem",
            }}
            onClick={handleComplete}
          >
            Complete Lesson
          </button>
        </>
      ) : (
        <>
          <div style={{ margin: "2rem 0", fontSize: "1.15em", color: theme.secondary }}>
            <p>
              Congratulations! You've learned <b>Wingardium Leviosa</b>. Objects can now fly at your command!
            </p>
          </div>
          <button
            style={{
              background: theme.primary,
              color: "#fff",
              padding: "1rem 1.5rem",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              border: "none",
              cursor: "pointer",
              marginBottom: "1.5rem",
            }}
            onClick={() => navigate("/school")}
          >
            Return to School
          </button>
        </>
      )}
    </div>
  );
};

export default WingardiumLeviosaLesson;

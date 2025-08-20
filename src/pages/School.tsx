import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Character } from "../types";
import { houseThemes } from "../themes";

interface Props {
  character: Character;
}

const classTabs = [
  { key: "charms", label: "Charms" },
  { key: "potions", label: "Potions (Coming Soon)" },
  { key: "dada", label: "Defence Against the Dark Arts (Coming Soon)" },
  { key: "muggle", label: "Muggle Studies (Coming Soon)" },
  { key: "creatures", label: "Care of Magical Creatures (Coming Soon)" }
];

const yearTabs = [
  { key: "year1", label: "Year One" }
  // Add more years as needed
];

const charmsLessonsYear1 = [
  {
    title: "Alohomora",
    path: "/school/alohomora-lesson",
    desc: "Unlocking Charm",
    comingSoon: false,
  },
  {
    title: "Lumos/Nox",
    path: "/school/lumos-lesson",
    desc: "Wand-Lighting/Dousing Charm",
    comingSoon: false,
  },
  {
    title: "Wingardium Leviosa",
    path: "/school/wingardium-leviosa-lesson",
    desc: "Levitation Charm",
    comingSoon: false,
  },
  {
    title: "Incendio",
    path: "#",
    desc: "Fire-Making Spell",
    comingSoon: true,
  },
  {
    title: "Reparo",
    path: "#",
    desc: "Mending Charm",
    comingSoon: true,
  },
];

const School: React.FC<Props> = ({ character }) => {
  const theme = houseThemes[character.house];
  const navigate = useNavigate();

  // State for tabs
  const [selectedClass, setSelectedClass] = useState("charms");
  const [selectedYear, setSelectedYear] = useState("year1");

  // Example custom logic for unlocking (if needed)
  // const completedLessons = character.completedLessons || [];

  // Only Charms is available for now
  function renderLessons() {
    if (selectedClass === "charms" && selectedYear === "year1") {
      return (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.1rem",
            justifyContent: "center",
            margin: "2rem 0 1rem",
          }}
        >
          {charmsLessonsYear1.map(lesson =>
            lesson.comingSoon ? (
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
                  border: "none",
                  opacity: 0.7,
                  cursor: "not-allowed",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                  marginBottom: "0.5rem"
                }}
                title="Coming Soon"
              >
                {lesson.title}
                <div style={{
                  fontWeight: "normal",
                  fontSize: "0.95em",
                  marginTop: "0.3em",
                  color: theme.secondary
                }}>
                  {lesson.desc} <br /><span style={{ fontSize: "0.9em" }}>Coming Soon</span>
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
                  transition: "background .15s"
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
            )
          )}
        </div>
      );
    }
    // For non-charms classes, just show "Coming Soon"
    return (
      <div
        style={{
          margin: "2rem 0 1rem",
          color: theme.secondary,
          fontSize: "1.2em",
          fontStyle: "italic",
          textAlign: "center"
        }}
      >
        {classTabs.find(c => c.key === selectedClass)?.label}
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
        maxWidth: "700px",
        margin: "3rem auto",
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        fontFamily: "serif",
        textAlign: "center",
        position: "relative",
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
      <h2>Hogwarts School</h2>
      <div style={{
        margin: "1.2rem 0",
        display: "flex",
        justifyContent: "center",
        gap: "0.5rem"
      }}>
        {classTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedClass(tab.key)}
            disabled={tab.key !== "charms"}
            style={{
              background: selectedClass === tab.key ? theme.primary : "#ececec",
              color: selectedClass === tab.key ? "#fff" : "#666",
              border: selectedClass === tab.key ? `2px solid ${theme.secondary}` : "1px solid #ccc",
              borderRadius: "8px",
              padding: "0.6rem 1.2rem",
              fontWeight: "bold",
              fontSize: "1.05rem",
              cursor: tab.key === "charms" ? "pointer" : "not-allowed",
              opacity: tab.key === "charms" ? 1 : 0.6,
              minWidth: "170px"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{
        margin: "1.2rem 0 0.5rem",
        display: "flex",
        justifyContent: "center",
        gap: "0.5rem"
      }}>
        {yearTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedYear(tab.key)}
            style={{
              background: selectedYear === tab.key ? theme.secondary : "#ececec",
              color: selectedYear === tab.key ? "#fff" : "#666",
              border: selectedYear === tab.key ? `2px solid ${theme.primary}` : "1px solid #ccc",
              borderRadius: "8px",
              padding: "0.5rem 1.4rem",
              fontWeight: "bold",
              fontSize: "1.02rem",
              cursor: "pointer",
              opacity: 1,
              minWidth: "140px"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {renderLessons()}
      <div style={{
        marginTop: "1.6rem",
        color: theme.secondary,
        fontSize: "0.97em"
      }}>
        (More years and classes coming soon!)
      </div>
    </div>
  );
};

export default School;

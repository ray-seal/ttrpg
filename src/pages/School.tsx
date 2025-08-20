import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Character } from "../types";
import { houseThemes } from "../themes";

// Constants
const classTabs = [
  { key: "charms", label: "Charms" },
  { key: "potions", label: "Potions (Coming Soon)" },
  { key: "dada", label: "Defence Against the Dark Arts (Coming Soon)" },
  { key: "muggle", label: "Muggle Studies (Coming Soon)" },
  { key: "creatures", label: "Care of Magical Creatures (Coming Soon)" }
];
const yearTabs = [{ key: "year1", label: "Year One" }];
const timetableItemId = "year_one_timetable";

// Lessons must be done in order; lock all except first, and then each until previous is complete.
const charmsLessonsYear1 = [
  {
    title: "Alohomora",
    path: "/school/alohomora-lesson",
    desc: "Unlocking Charm",
    comingSoon: false,
  },
  {
    title: "Wingardium Leviosa",
    path: "/school/wingardium-leviosa-lesson",
    desc: "Levitation Charm",
    comingSoon: false,
  },
  {
    title: "Lumos/Nox",
    path: "/school/lumos-lesson",
    desc: "Wand-Lighting/Dousing Charm",
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

interface Props {
  character: Character;
  setCharacter?: (c: Character) => void;
}

const School: React.FC<Props> = ({ character, setCharacter }) => {
  const theme = houseThemes[character.house];
  const navigate = useNavigate();

  // UI state for tabs
  const [selectedClass, setSelectedClass] = useState("charms");
  const [selectedYear, setSelectedYear] = useState("year1");
  const [hasTimetable, setHasTimetable] = useState(false);
  const [givingTimetable, setGivingTimetable] = useState(false);
  const [loading, setLoading] = useState(true);

  // Assume completedLessons is a string[] of lesson titles
  const completedLessons: string[] = character.completedLessons || [];

  // 1. Check for timetable item on mount
  useEffect(() => {
    let active = true;
    async function checkTimetable() {
      setLoading(true);
      const { data, error } = await supabase
        .from("character_items")
        .select("*")
        .eq("character_id", character.id)
        .eq("item_id", timetableItemId)
        .maybeSingle();
      if (active) setHasTimetable(!!data);
      setLoading(false);
    }
    checkTimetable();
    return () => {
      active = false;
    };
  }, [character.id]);

  // 2. Handler to give the timetable and update Supabase
  async function handleGiveTimetable() {
    setGivingTimetable(true);
    // Add to character_items
    const { error } = await supabase
      .from("character_items")
      .insert([{ character_id: character.id, item_id: timetableItemId }]);
    if (!error) {
      setHasTimetable(true);
      // Optionally, update character in parent if needed
      if (setCharacter) {
        setCharacter({ ...character });
      }
    }
    setGivingTimetable(false);
  }

  // 3. Rendering when timetable not owned
  if (loading) {
    return <div style={{ textAlign: "center", margin: "3rem" }}>Loading School...</div>;
  }

  if (!hasTimetable) {
    return (
      <div style={{
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
      }}>
        <h2>Timetable Required</h2>
        <p>
          You need your Year One Timetable to attend classes.<br />
          (Your head of house can give you your timetable.)
        </p>
        <button
          onClick={handleGiveTimetable}
          disabled={givingTimetable}
          style={{
            margin: "1.2rem auto 1rem",
            padding: "0.8rem 2.2rem",
            borderRadius: "8px",
            background: theme.secondary,
            color: "#fff",
            border: "none",
            fontWeight: "bold",
            fontSize: "1.08rem",
            cursor: "pointer",
            boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
            display: "block"
          }}
        >
          {givingTimetable ? "Handing you your timetable..." : "Thank your Head of House"}
        </button>
        <Link
          to="/"
          style={{
            display: "inline-block",
            marginTop: "1.4rem",
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
      </div>
    );
  }

  // 4. Charms lessons with lock order (must complete previous to unlock next)
  function renderCharmsLessons() {
    let unlockedIndex = 0;
    for (let i = 0; i < charmsLessonsYear1.length; i++) {
      if (charmsLessonsYear1[i].comingSoon) break;
      if (completedLessons.includes(charmsLessonsYear1[i].title)) {
        unlockedIndex = i + 1;
      } else {
        break;
      }
    }

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
        {charmsLessonsYear1.map((lesson, idx) => {
          // Only unlock in order and not if lesson is coming soon
          const isUnlocked = !lesson.comingSoon && idx <= unlockedIndex;
          const isCompleted = completedLessons.includes(lesson.title);

          if (lesson.comingSoon) {
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
                  border: "none",
                  opacity: 0.7,
                  cursor: "not-allowed",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                  marginBottom: "0.5rem"
                }}
                title="Coming Soon"
              >
                {lesson.title}
                <div style={{ fontWeight: "normal", fontSize: "0.95em", marginTop: "0.3em", color: theme.secondary }}>
                  {lesson.desc} <br /><span style={{ fontSize: "0.9em" }}>Coming Soon</span>
                </div>
              </button>
            );
          }

          if (isUnlocked) {
            return (
              <Link
                key={lesson.title}
                to={lesson.path}
                style={{
                  background: isCompleted ? "#76b852" : theme.primary,
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
                <div style={{ fontWeight: "normal", fontSize: "0.95em", marginTop: "0.3em", color: theme.accent }}>
                  {lesson.desc}
                  {isCompleted && (
                    <span style={{ color: "#eee", marginLeft: "0.5em", fontWeight: "bold" }}>✓</span>
                  )}
                </div>
              </Link>
            );
          }
          // Locked (not completed previous)
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
                border: "none",
                opacity: 0.7,
                cursor: "not-allowed",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                marginBottom: "0.5rem"
              }}
              title="Complete previous lesson to unlock"
            >
              {lesson.title}
              <div style={{ fontWeight: "normal", fontSize: "0.95em", marginTop: "0.3em", color: theme.secondary }}>
                {lesson.desc}
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // 5. Main render
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
      {/* Class Tabs */}
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
      {/* Year Tabs */}
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
      {/* Lessons for selected tab/year */}
      {selectedClass === "charms" && selectedYear === "year1" && renderCharmsLessons()}
      {selectedClass !== "charms" && (
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
      )}
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

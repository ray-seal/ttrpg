import React, { useState } from "react";
import { Character } from "../types";
import ThemedLayout from "../components/ThemedLayout";
import { houseThemes, House } from "../themes";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

// IDs for scarf and timetable
const HOUSE_SCARF_ID = "b5b1a2e6-0c74-4bfc-9c5d-555555555555";
const YEAR_ONE_TIMETABLE_ID = "b7a8e1a9-bd62-4d50-8e2a-111111111111";

const School: React.FC<{
  character: Character;
  setCharacter: (c: Character) => void;
}> = ({ character, setCharacter }) => {
  const theme = houseThemes[character.house as House];
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [givingItems, setGivingItems] = useState(false);

  // Check ownership of scarf & timetable
  const ownsScarf = character.items?.some(item => item.item_id === HOUSE_SCARF_ID);
  const ownsTimetable = character.items?.some(item => item.item_id === YEAR_ONE_TIMETABLE_ID);
  const alreadyReceived = ownsScarf && ownsTimetable;

  const handleTalkToHead = async () => {
    setShowPopup(true);
    if (!alreadyReceived && !givingItems) {
      setGivingItems(true);
      // Only insert if not already present
      const newItems = [];
      if (!ownsScarf) newItems.push({ character_id: character.id, item_id: HOUSE_SCARF_ID });
      if (!ownsTimetable) newItems.push({ character_id: character.id, item_id: YEAR_ONE_TIMETABLE_ID });
      if (newItems.length > 0) {
        await supabase.from("character_items").insert(newItems);
      }
      // Update character's items
      if (setCharacter) {
        const { data: items } = await supabase
          .from("character_items")
          .select("*")
          .eq("character_id", character.id);
        setCharacter({ ...character, items });
      }
      setGivingItems(false);
    }
  };

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

      {/* Head of House section */}
      {!alreadyReceived && (
        <div style={{ textAlign: "center", marginBottom: "2em" }}>
          <button
            disabled={givingItems}
            onClick={handleTalkToHead}
            style={{
              padding: "0.7em 1.6em",
              fontWeight: "bold",
              fontSize: "1.1em",
              background: "#f6e8c0",
              border: "2px solid #b79b5a",
              borderRadius: 8,
              cursor: givingItems ? "not-allowed" : "pointer",
              opacity: givingItems ? 0.7 : 1,
              marginBottom: "1em"
            }}
          >
            Talk to Head of House
          </button>
        </div>
      )}
      {alreadyReceived && (
        <div style={{ marginBottom: "2em", fontWeight: "bold", color: "green", textAlign:"center" }}>
          You have already received your {character.house} scarf and timetable.
        </div>
      )}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2em",
              borderRadius: 12,
              maxWidth: 380,
              textAlign: "center",
              boxShadow: "0 4px 16px rgba(0,0,0,0.16)"
            }}
          >
            <div style={{ marginBottom: "1.2em" }}>
              Your head of house welcomes you to <b>{character.house}</b> and gives you a <b>{character.house} scarf</b> and <b>Year One Timetable</b>!
            </div>
            <button
              onClick={() => setShowPopup(false)}
              style={{
                fontWeight: "bold",
                padding: "0.5em 1.5em",
                background: "#f6e8c0",
                border: "2px solid #b79b5a",
                borderRadius: 8,
                cursor: "pointer"
              }}
            >
              Thank you!
            </button>
          </div>
        </div>
      )}

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

import React, { useEffect, useState } from "react";
import { Character } from "../types";
import { supabase } from "../supabaseClient";

type HousePoints = {
  id: string;
  house: string;
  points: number;
};

const CharacterSheet: React.FC<{ character: Character }> = ({ character }) => {
  const [housePoints, setHousePoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch house points from Supabase
    async function fetchHousePoints() {
      setLoading(true);
      if (character.house) {
        const { data, error } = await supabase
          .from<HousePoints>("house_points")
          .select("points")
          .eq("house", character.house)
          .single();
        if (!error && data) {
          setHousePoints(data.points);
        } else {
          setHousePoints(null);
        }
      }
      setLoading(false);
    }
    fetchHousePoints();
  }, [character.house]);

  if (!character) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>No character loaded.</div>;
  }
  if (
    !character.house ||
    character.magic == null ||
    character.knowledge == null ||
    character.courage == null ||
    character.agility == null ||
    character.charisma == null
  ) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        Your sorting is not complete. Please finish the sorting ceremony.
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        padding: "2.5rem",
        background: "#f5efd9",
        borderRadius: 14,
        fontFamily: "serif",
        color: "#432c15",
        border: "2px solid #b79b5a"
      }}
    >
      <h2
        style={{
          fontFamily: "cursive",
          textAlign: "center",
          marginBottom: "1.5rem",
          color: "#1e1c17"
        }}
      >
        {character.name} — {character.house}
      </h2>
      <ul>
        <li>
          <b>Galleons:</b> {character.wizarding_money}
        </li>
        <li>
          <b>Experience:</b> {character.experience ?? 0}
        </li>
        <li>
          <b>House Points:</b>{" "}
          {loading ? (
            <span>Loading...</span>
          ) : housePoints !== null ? (
            housePoints
          ) : (
            <span>Unavailable</span>
          )}
        </li>
      </ul>
      <div style={{ marginTop: "2rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Attributes</h3>
        <ul>
          <li>
            <b>Magic:</b> {character.magic}
          </li>
          <li>
            <b>Knowledge:</b> {character.knowledge}
          </li>
          <li>
            <b>Courage:</b> {character.courage}
          </li>
          <li>
            <b>Agility:</b> {character.agility}
          </li>
          <li>
            <b>Charisma:</b> {character.charisma}
          </li>
        </ul>
      </div>
      {/* Add more character info here if needed */}
    </div>
  );
};

export default CharacterSheet;

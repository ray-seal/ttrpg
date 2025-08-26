import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ThemedLayout, { boxStyle } from "../components/ThemedLayout";
import { useNavigate } from "react-router-dom";
import { houseThemes, House } from "../themes";

type Character = {
  id: string;
  name: string;
  house: House;
  wizarding_money: number;
  experience?: number;
  magic: number;
  knowledge: number;
  courage: number;
  agility: number;
  charisma: number;
};

type HousePoints = {
  house: string;
  points: number;
};

const CharacterSheet: React.FC<{ character: Character }> = ({ character }) => {
  const [housePoints, setHousePoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = houseThemes[character.house as House];

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

  if (
    !character.house ||
    character.magic == null ||
    character.knowledge == null ||
    character.courage == null ||
    character.agility == null ||
    character.charisma == null
  ) {
    return (
      <ThemedLayout character={character}>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          Your sorting is not complete. Please finish the sorting ceremony.
        </div>
        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: theme.accent,
              color: theme.primary,
              padding: "0.8rem 2rem",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            Back to Home
          </button>
        </div>
      </ThemedLayout>
    );
  }

  return (
    <ThemedLayout character={character}>
      <h2
        style={{
          fontFamily: "cursive",
          textAlign: "center",
          marginBottom: "1.5rem",
          color: theme.secondary,
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
      <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: theme.accent,
            color: theme.primary,
            padding: "0.8rem 2rem",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          Back to Home
        </button>
      </div>
    </ThemedLayout>
  );
};

export default CharacterSheet;

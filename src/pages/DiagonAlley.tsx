import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Character } from "../types";
import MoneyBanner from "../components/MoneyBanner";

const WAND_ITEM_ID = "9c1c1a36-8f3f-4c0e-b9b1-222222222222";
const ROBES_ITEM_ID = "37e9c6fb-3f81-4d7d-9c3c-444444444444";

const DiagonAlley: React.FC<{ character: Character }> = ({ character }) => {
  const [items, setItems] = useState<{ item_id: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    supabase
      .from("character_items")
      .select("item_id")
      .eq("character_id", character.id)
      .then(({ data }) => {
        if (mounted) {
          setItems(data || []);
          setLoading(false);
        }
      });
    return () => { mounted = false };
  }, [character.id]);

  const hasWand = items.some(item => item.item_id === WAND_ITEM_ID);
  const hasRobes = items.some(item => item.item_id === ROBES_ITEM_ID);
  const canGoToKingsCross = hasWand && hasRobes;

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "2rem", background: "#f5efd9", borderRadius: 16, border: "2px solid #b79b5a", fontFamily: "serif" }}>
      <MoneyBanner galleons={character.wizarding_money} />
      <h2 style={{ fontFamily: "cursive", textAlign: "center", color: "#1e1c17", margin: "2rem 0 1.25rem" }}>
        Welcome to Diagon Alley!
      </h2>
      <p>
        Here you can purchase all your Hogwarts supplies. You'll need a <b>wand</b> and <b>school robes</b> to travel to King's Cross and board the Hogwarts Express.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", margin: "2rem 0" }}>
        <button
          onClick={() => navigate("/ollivanders")}
          style={{
            background: "#b79b5a",
            color: "#fff",
            padding: "1rem 2rem",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "1rem",
            border: "none",
            cursor: "pointer"
          }}
        >
          Go to Ollivanders
        </button>
        <button
          onClick={() => navigate("/madam-malkins")}
          style={{
            background: "#b79b5a",
            color: "#fff",
            padding: "1rem 2rem",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "1rem",
            border: "none",
            cursor: "pointer"
          }}
        >
          Go to Madam Malkins
        </button>
      </div>
      <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
        <button
          onClick={() => canGoToKingsCross && navigate("/hogwarts-express")}
          disabled={!canGoToKingsCross || loading}
          style={{
            background: canGoToKingsCross ? "#4287f5" : "#ccc",
            color: "#fff",
            padding: "1rem 2rem",
            borderRadius: "8px",
            border: "none",
            fontWeight: "bold",
            fontSize: "1.1rem",
            cursor: canGoToKingsCross ? "pointer" : "not-allowed",
            marginTop: "2rem"
          }}
        >
          Go to King's Cross Station
        </button>
        {!canGoToKingsCross && !loading && (
          <p style={{ color: "#b22222", marginTop: 10 }}>
            You need both a wand and school robes to board the train!
          </p>
        )}
      </div>
    </div>
  );
};

export default DiagonAlley;

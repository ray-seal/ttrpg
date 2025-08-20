import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Character } from "../types";

// Use the UUID for your "Basic Wand" from the items table
const WAND_ITEM_ID = "9c1c1a36-8f3f-4c0e-b9b1-222222222222";
const WAND_COST = 15;

const Ollivanders: React.FC<{ character: Character }> = ({ character }) => {
  const navigate = useNavigate();
  const [purchased, setPurchased] = useState(false);

  const alreadyHasWand = async () => {
    const { data } = await supabase
      .from("character_items")
      .select("id")
      .eq("character_id", character.id)
      .eq("item_id", WAND_ITEM_ID)
      .maybeSingle();
    return !!data;
  };

  const handlePurchase = async () => {
    if (character.wizarding_money < WAND_COST) return;
    // Only allow purchase if not already owned
    if (!(await alreadyHasWand())) {
      await supabase
        .from("character_items")
        .insert([{ character_id: character.id, item_id: WAND_ITEM_ID }]);
      await supabase
        .from("characters")
        .update({ wizarding_money: character.wizarding_money - WAND_COST })
        .eq("id", character.id);
      setPurchased(true);
    }
  };

  return (
    <div style={{
      maxWidth: 600, margin: "2rem auto", padding: "2.5rem",
      background: "#f5efd9", borderRadius: 14, fontFamily: "serif", color: "#432c15", border: "2px solid #b79b5a"
    }}>
      <h2 style={{ fontFamily: "cursive", textAlign: "center", marginBottom: "1.5rem", color: "#1e1c17" }}>
        Ollivanders: Makers of Fine Wands
      </h2>
      <p>
        The shop is narrow and shabby, but inside are thousands of wands stacked neatly. Mr. Ollivander helps you find your perfect wand.
      </p>
      <p>
        <b>Basic Wand</b>: {WAND_COST} Galleons
      </p>
      {purchased ? (
        <div style={{ color: "#2d6a4f", fontWeight: "bold", margin: "1.5rem 0" }}>
          Congratulations! You have your wand.
        </div>
      ) : (
        <button
          onClick={handlePurchase}
          disabled={character.wizarding_money < WAND_COST}
          style={{
            background: character.wizarding_money < WAND_COST ? "#ccc" : "#b79b5a",
            color: "#fff",
            padding: "1rem 2.2rem",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "1.1rem",
            border: "none",
            cursor: character.wizarding_money < WAND_COST ? "not-allowed" : "pointer",
            margin: "1.4rem 0"
          }}
        >
          Buy Wand
        </button>
      )}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button
          onClick={() => navigate("/diagon-alley")}
          style={{
            background: "#4287f5",
            color: "#fff",
            padding: "0.75rem 2rem",
            borderRadius: "8px",
            border: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          }}
        >
          Back to Diagon Alley
        </button>
      </div>
    </div>
  );
};
export default Ollivanders;

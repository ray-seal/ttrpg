import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Character } from "../types";
import MoneyBanner from "../components/MoneyBanner";

const WAND_ITEM_ID = "9c1c1a36-8f3f-4c0e-b9b1-222222222222"; // Basic Wand
const WAND_COST = 15;

const Ollivanders: React.FC<{ character: Character; setCharacter?: (c: Character) => void }> = ({
  character,
  setCharacter,
}) => {
  const [localCharacter, setLocalCharacter] = useState<Character>(character);
  const [purchased, setPurchased] = useState(false);
  const [error, setError] = useState("");
  const [alreadyOwned, setAlreadyOwned] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLocalCharacter(character);
    checkAlreadyHasWand();
    // eslint-disable-next-line
  }, [character]);

  async function checkAlreadyHasWand() {
    const { data } = await supabase
      .from("character_items")
      .select("id")
      .eq("character_id", character.id)
      .eq("item_id", WAND_ITEM_ID)
      .maybeSingle();
    setAlreadyOwned(!!data);
  }

  async function fetchCharacter() {
    const { data } = await supabase
      .from("characters")
      .select("*")
      .eq("id", character.id)
      .single();
    if (data) {
      setLocalCharacter(data);
      if (setCharacter) setCharacter(data);
    }
  }

  const handlePurchase = async () => {
    setError("");
    if (localCharacter.wizarding_money < WAND_COST) {
      setError("You don't have enough galleons.");
      return;
    }
    if (alreadyOwned) {
      setError("You already have a wand!");
      return;
    }
    // 1. Deduct money in DB FIRST (fail-safe)
    const { error: moneyError } = await supabase
      .from("characters")
      .update({ wizarding_money: localCharacter.wizarding_money - WAND_COST })
      .eq("id", character.id);
    if (moneyError) {
      setError("Failed to deduct money.");
      return;
    }
    // 2. Add wand to inventory in DB
    const { error: wandError } = await supabase
      .from("character_items")
      .upsert(
        [{ character_id: character.id, item_id: WAND_ITEM_ID, quantity: 1 }],
        { onConflict: ["character_id", "item_id"] }
      );
    if (wandError) {
      setError("Failed to add wand to inventory.");
      // Optionally: refund money if wand insert fails
      await supabase
        .from("characters")
        .update({ wizarding_money: localCharacter.wizarding_money })
        .eq("id", character.id);
      return;
    }
    setPurchased(true);
    // 3. Update local state to reflect changes immediately
    setLocalCharacter((lc) => ({
      ...lc,
      wizarding_money: lc.wizarding_money - WAND_COST,
    }));
    if (setCharacter) {
      setCharacter({
        ...localCharacter,
        wizarding_money: localCharacter.wizarding_money - WAND_COST,
      });
    }
    await fetchCharacter(); // re-sync from DB
    await checkAlreadyHasWand();
  };

  return (
    <div>
      <MoneyBanner galleons={localCharacter.wizarding_money} />
      <div
        style={{
          maxWidth: 600,
          margin: "2rem auto",
          padding: "2.5rem",
          background: "#f5efd9",
          borderRadius: 14,
          fontFamily: "serif",
          color: "#432c15",
          border: "2px solid #b79b5a",
        }}
      >
        <h2
          style={{
            fontFamily: "cursive",
            textAlign: "center",
            marginBottom: "1.5rem",
            color: "#1e1c17",
          }}
        >
          Ollivanders: Makers of Fine Wands
        </h2>
        <p>
          The shop is narrow and shabby, but inside are thousands of wands stacked neatly. Mr. Ollivander helps you find your perfect wand.
        </p>
        <p>
          <b>Basic Wand</b>: {WAND_COST} Galleons
        </p>
        {error && (
          <div style={{ color: "crimson", marginBottom: 10 }}>{error}</div>
        )}
        {purchased || alreadyOwned ? (
          <div
            style={{
              color: "#2d6a4f",
              fontWeight: "bold",
              margin: "1.5rem 0",
            }}
          >
            Congratulations! You have your wand.
          </div>
        ) : (
          <button
            onClick={handlePurchase}
            disabled={localCharacter.wizarding_money < WAND_COST}
            style={{
              background:
                localCharacter.wizarding_money < WAND_COST
                  ? "#ccc"
                  : "#b79b5a",
              color: "#fff",
              padding: "1rem 2.2rem",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              border: "none",
              cursor:
                localCharacter.wizarding_money < WAND_COST
                  ? "not-allowed"
                  : "pointer",
              margin: "1.4rem 0",
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
    </div>
  );
};

export default Ollivanders;

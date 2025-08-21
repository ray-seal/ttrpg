import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Character } from "../types";
import MoneyBanner from "../components/MoneyBanner";

const PARENT_MONEY = 200; // muggle pounds for flavor
const INITIAL_WIZARDING_MONEY = 50; // Give 50 galleons

// Add setCharacter prop for local+global state updates
const GringottsBank: React.FC<{ character: Character; setCharacter?: (c: Character) => void }> = ({ character, setCharacter }) => {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [localCharacter, setLocalCharacter] = useState<Character>(character);

  useEffect(() => {
    async function grantMoney() {
      if (character.wizarding_money < INITIAL_WIZARDING_MONEY) {
        await supabase
          .from("characters")
          .update({ wizarding_money: INITIAL_WIZARDING_MONEY })
          .eq("id", character.id);
        // Update local state and parent/global state
        const newChar = { ...character, wizarding_money: INITIAL_WIZARDING_MONEY };
        setLocalCharacter(newChar);
        if (setCharacter) setCharacter(newChar);
      } else {
        setLocalCharacter(character);
        if (setCharacter) setCharacter(character);
      }
      setDone(true);
    }
    grantMoney();
    // eslint-disable-next-line
  }, [character.id]);

  return (
    <div>
      <MoneyBanner galleons={localCharacter.wizarding_money} />
      <div style={{
        maxWidth: 600, margin: "2rem auto", padding: "2.5rem",
        background: "#f5efd9", borderRadius: 14, fontFamily: "serif", color: "#432c15", border: "2px solid #b79b5a"
      }}>
        <h2 style={{ fontFamily: "cursive", textAlign: "center", marginBottom: "1.8rem", color: "#1e1c17" }}>
          Gringotts Bank
        </h2>
        <p>
          Your parents hand you <b>£{PARENT_MONEY}</b> in muggle money, which the goblins at Gringotts exchange for <b>50 Galleons</b>.
        </p>
        <p>
          This should be enough for your essential school supplies, with plenty left over!
        </p>
        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <button
            onClick={() => navigate("/diagon-alley")}
            style={{
              background: "#b79b5a", color: "#fff", padding: "1rem 2.2rem",
              borderRadius: "8px", fontWeight: "bold", fontSize: "1.1rem", border: "none", cursor: "pointer"
            }}
          >
            Back to Diagon Alley
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            onClick={() => navigate("/")}
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
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
export default GringottsBank;

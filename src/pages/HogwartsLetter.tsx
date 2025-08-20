import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const HogwartsLetter: React.FC<{ character: any }> = ({ character }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleContinue() {
    setLoading(true);
    // Mark the letter as read in DB
    await supabase.from("characters").update({ letter_read: true }).eq("id", character.id);
    setLoading(false);
    // You can show supply list as next step if desired, otherwise go straight to Diagon Alley:
    // navigate("/hogwarts-supply-list");
    navigate("/diagon-alley");
  }

  return (
    <div style={{
      maxWidth: 600,
      margin: "3rem auto",
      padding: "2.5rem",
      background: "#f5efd9",
      borderRadius: 14,
      fontFamily: "serif",
      color: "#432c15",
      border: "2px solid #b79b5a"
    }}>
      <h2 style={{
        fontFamily: "cursive",
        textAlign: "center",
        marginBottom: "2rem",
        color: "#1e1c17"
      }}>
        Your Hogwarts Letter
      </h2>
      <p>
        Dear {character.name},<br /><br />
        We are pleased to inform you that you have a place at Hogwarts School of Witchcraft and Wizardry.<br /><br />
        Term begins on 1 September. Please find enclosed a list of all necessary books and equipment.<br /><br />
        We await your owl by no later than 31 July.<br /><br />
        Yours sincerely,<br />
        Minerva McGonagall<br />
        Deputy Headmistress
      </p>
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button
          onClick={handleContinue}
          disabled={loading}
          style={{
            background: "#4287f5",
            color: "#fff",
            padding: "0.9rem 2.5rem",
            borderRadius: "8px",
            border: "none",
            fontWeight: "bold",
            fontSize: "1.15rem",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
          }}
        >
          {loading ? "Continuing..." : "Continue to Diagon Alley"}
        </button>
      </div>
    </div>
  );
};

export default HogwartsLetter;

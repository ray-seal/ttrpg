import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const HogwartsLetter: React.FC<{ character: any, setCharacter?: (c: any) => void }> = ({ character, setCharacter }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleContinue() {
    setLoading(true);
    // Update letter_read in DB
    const { error } = await supabase
      .from("characters")
      .update({ letter_read: true })
      .eq("id", character.id);
    // Immediately update local state if possible
    if (setCharacter) setCharacter({ ...character, letter_read: true });
    setLoading(false);
    if (!error) navigate("/diagon-alley");
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
        {/* ... letter content ... */}
        We are pleased to inform you that you have been accepted at Hogwarts School of Witchcraft and Wizardry...
      </p>
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <button onClick={handleContinue} disabled={loading} style={{ fontSize: "1.1em", padding: "0.6em 2.2em" }}>
          {loading ? "Continuing..." : "Continue to Diagon Alley"}
        </button>
      </div>
    </div>
  );
};

export default HogwartsLetter;

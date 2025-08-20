import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { Character } from "../types";
import { useNavigate } from "react-router-dom";

const CharacterCreation: React.FC<{ userId: string; onCreate: (char: Character) => void }> = ({ userId, onCreate }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setLoading(true);
    setError(null);
    // Insert character without house (will sort later)
    const { data, error: dbError } = await supabase
      .from("characters")
      .insert([{ user_id: userId, name: name.trim(), house: null, wizarding_money: 0 }])
      .select()
      .single();
    setLoading(false);
    if (dbError || !data) {
      setError("Could not create character. Try again.");
      return;
    }
    onCreate(data as Character);
    navigate("/hogwarts-letter");
  }

  return (
    <div style={{
      maxWidth: 430, margin: "3rem auto", padding: "2.5rem",
      background: "#f5efd9", borderRadius: 14, fontFamily: "serif", color: "#432c15", border: "2px solid #b79b5a"
    }}>
      <h2 style={{ fontFamily: "cursive", textAlign: "center", marginBottom: "1.5rem", color: "#1e1c17" }}>
        Create Your Character
      </h2>
      <form onSubmit={handleSubmit}>
        <label style={{ fontWeight: "bold" }}>Your Name:</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={32}
          required
          style={{
            width: "100%", padding: "0.7rem", margin: "0.75rem 0 1.5rem 0",
            borderRadius: 7, border: "1.5px solid #b79b5a", fontSize: "1.1em"
          }}
        />
        {error && <div style={{ color: "crimson", marginBottom: 10 }}>{error}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#b79b5a",
            color: "#fff",
            padding: "1rem 2.2rem",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "1.1rem",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Creating..." : "Start Your Journey"}
        </button>
      </form>
    </div>
  );
};

export default CharacterCreation;

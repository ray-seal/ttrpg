import React from "react";
import { useNavigate } from "react-router-dom";
import MoneyBanner from "../components/MoneyBanner";
import { useLocation } from "react-router-dom";
import { Character } from "../types";

const DiagonAlley: React.FC<{ character?: Character }> = ({ character }) => {
  const navigate = useNavigate();
  // Optionally, you can get character from context or props
  // If character prop isn't passed, you may want to fetch from context/store

  return (
    <div>
      {character && <MoneyBanner galleons={character.wizarding_money} />}
      <div style={{
        maxWidth: 700,
        margin: "2rem auto",
        padding: "2.5rem",
        background: "#f5efd9",
        borderRadius: 14,
        fontFamily: "serif",
        color: "#432c15",
        border: "2px solid #b79b5a"
      }}>
        <h2 style={{ fontFamily: "cursive", textAlign: "center", marginBottom: "1.8rem", color: "#1e1c17" }}>
          Diagon Alley
        </h2>
        <p>
          The bustling street is filled with witches and wizards shopping for all their magical needs. Where would you like to go first?
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginTop: "2rem" }}>
          <button onClick={() => navigate("/gringotts-bank")} style={buttonStyle}>Gringotts Bank</button>
          <button onClick={() => navigate("/ollivanders")} style={buttonStyle}>Ollivanders - Buy a Wand</button>
          <button onClick={() => navigate("/madam-malkins")} style={buttonStyle}>Madam Malkin’s - Buy Robes</button>
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

const buttonStyle = {
  background: "#b79b5a",
  color: "#fff",
  padding: "1rem 2.2rem",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "1.1rem",
  border: "none",
  cursor: "pointer",
};

export default DiagonAlley;

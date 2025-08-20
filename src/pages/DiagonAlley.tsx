import React from "react";
import { useNavigate } from "react-router-dom";

const DiagonAlley: React.FC = () => {
  const navigate = useNavigate();
  return (
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
        <button onClick={() => navigate("/buy-wand")} style={buttonStyle}>Ollivanders</button>
        <button onClick={() => navigate("/buy-robes")} style={buttonStyle}>Madam Malkin’s</button>
        {/* Add more locations as desired */}
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

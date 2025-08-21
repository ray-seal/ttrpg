import React from "react";
import { Link } from "react-router-dom";

const DiagonAlley: React.FC<{ character: any, onComplete?: () => void }> = ({ character, onComplete }) => {
  // ... your items/shop logic here

  return (
    <div style={{
      maxWidth: 800,
      margin: "2rem auto",
      padding: "2rem",
      background: "#f9f6ed",
      borderRadius: 12,
      border: "2px solid #d3b97c"
    }}>
      <h1 style={{ fontFamily: "cursive", textAlign: "center" }}>Diagon Alley</h1>
      <div style={{ textAlign: "center", margin: "1.5em 0" }}>
        <Link
          to="/gringotts-bank"
          style={{
            display: "inline-block",
            padding: "0.7em 1.8em",
            background: "#ffd700",
            color: "#432c15",
            borderRadius: 8,
            fontWeight: "bold",
            border: "2px solid #b79b5a",
            textDecoration: "none",
            marginBottom: 16
          }}
        >
          🏦 Visit Gringotts Bank to get your wizarding money!
        </Link>
      </div>
      {/* ...rest of your Diagon Alley content, shops, purchase logic, etc... */}
      {/* Optionally, call onComplete() after all purchases are made */}
    </div>
  );
};

export default DiagonAlley;

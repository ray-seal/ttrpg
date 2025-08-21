import React from "react";
import { Link } from "react-router-dom";

const DiagonAlley: React.FC<{ character: any; onComplete?: () => void }> = ({ character, onComplete }) => {
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
            marginBottom: 16,
          }}
        >
          🏦 Visit Gringotts Bank to get your wizarding money!
        </Link>
      </div>

      <div style={{ margin: "2em 0" }}>
        <h2>Shops in Diagon Alley</h2>
        <ul style={{ listStyle: "none", padding: 0, fontSize: "1.15em" }}>
          <li style={{ margin: "1em 0" }}>
            <Link to="/ollivanders" style={{ color: "#6d4c1b", textDecoration: "underline", fontWeight: "bold" }}>
              🪄 Ollivanders Wand Shop
            </Link>
            <span style={{ marginLeft: 12, color: "#7a5d36" }}>Get your very first wand!</span>
          </li>
          <li style={{ margin: "1em 0" }}>
            <Link to="/madam-malkins" style={{ color: "#6d4c1b", textDecoration: "underline", fontWeight: "bold" }}>
              👗 Madam Malkin's Robes for All Occasions
            </Link>
            <span style={{ marginLeft: 12, color: "#7a5d36" }}>Buy your school robes here.</span>
          </li>
          {/* Add other shops here if needed */}
        </ul>
      </div>

      <hr style={{ margin: "2.5em 0" }} />

      <div style={{ textAlign: "center", margin: "2.5em 0" }}>
        <div style={{ fontStyle: "italic", fontSize: "1.07em", marginBottom: "1em" }}>
          You clutch your bags, your new wand, and your fresh Hogwarts robes. The bustling magic of Diagon Alley starts to fade as you realize it’s almost time to board the train…
        </div>
        <div style={{ fontWeight: 500, marginBottom: "1em" }}>
          Ready to head to King's Cross station and begin your Hogwarts adventure?
        </div>
        <Link
          to="/hogwarts-express"
          style={{
            display: "inline-block",
            padding: "0.8em 2em",
            background: "#5e3c00",
            color: "#fff",
            borderRadius: 8,
            fontWeight: "bold",
            border: "2px solid #b79b5a",
            fontSize: "1.09em",
            textDecoration: "none",
            marginTop: 8,
          }}
        >
          🚂 Go to King's Cross and board the Hogwarts Express
        </Link>
      </div>
    </div>
  );
};

export default DiagonAlley;

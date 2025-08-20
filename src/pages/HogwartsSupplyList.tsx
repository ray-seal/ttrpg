import React from "react";
import { useNavigate } from "react-router-dom";

const supplies = [
  "1 Wand",
  "3 sets of plain work robes (black)",
  "1 Cauldron (pewter, standard size 2)",
  "1 set of glass or crystal phials",
  "1 telescope",
  "1 set of brass scales",
  "1 pointed hat (black) for day wear",
  "1 pair of protective gloves (dragon hide or similar)",
  "1 winter cloak (black, silver fastenings)",
  "A copy of each of the following books:",
  "  - The Standard Book of Spells (Grade 1) by Miranda Goshawk",
  "  - A History of Magic by Bathilda Bagshot",
  "  - Magical Theory by Adalbert Waffling",
  "  - A Beginner’s Guide to Transfiguration by Emeric Switch",
  "  - One Thousand Magical Herbs and Fungi by Phyllida Spore",
  "  - Magical Drafts and Potions by Arsenius Jigger",
  "  - Fantastic Beasts and Where to Find Them by Newt Scamander",
  "  - The Dark Forces: A Guide to Self-Protection by Quentin Trimble"
];

const HogwartsSupplyList: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      maxWidth: 600, margin: "2rem auto", padding: "2.5rem",
      background: "#f9f6ef", borderRadius: 14, fontFamily: "serif", color: "#432c15", border: "2px solid #b79b5a"
    }}>
      <h2 style={{ fontFamily: "cursive", textAlign: "center", marginBottom: "1.2rem", color: "#1e1c17" }}>
        Hogwarts School Supply List
      </h2>
      <ul style={{ paddingLeft: "1.5em", fontSize: "1.06em" }}>
        {supplies.map((item, i) => (
          <li key={i} style={{ marginBottom: ".5em" }}>{item}</li>
        ))}
      </ul>
      <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
        <button
          onClick={() => navigate("/diagon-alley")}
          style={{
            background: "#b79b5a",
            color: "#fff",
            padding: "1rem 2.2rem",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "1.1rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Visit Diagon Alley
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
  );
};
export default HogwartsSupplyList;

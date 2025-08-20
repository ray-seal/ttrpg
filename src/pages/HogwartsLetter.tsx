import React from "react";
import { useNavigate } from "react-router-dom";

const HogwartsLetter: React.FC<{ character: { name: string } }> = ({ character }) => {
  const navigate = useNavigate();
  return (
    <div style={{
      maxWidth: 600, margin: "2rem auto", padding: "2.5rem",
      background: "#f5efd9", borderRadius: 14, boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
      fontFamily: "serif", color: "#432c15", border: "2px solid #b79b5a"
    }}>
      <h2 style={{ fontFamily: "cursive", textAlign: "center", marginBottom: "1.8rem", color: "#1e1c17", letterSpacing: ".06em" }}>
        Hogwarts School of Witchcraft and Wizardry
      </h2>
      <p>Dear {character.name},</p>
      <p>
        We are pleased to inform you that you have been accepted at Hogwarts School of Witchcraft and Wizardry.
        Please find enclosed a list of all necessary books and equipment.
      </p>
      <p>
        To prepare for your journey, you must first visit <b>Diagon Alley</b> to purchase your school supplies.
        Muggle currency may be exchanged for wizarding money at <b>Gringotts Bank</b>.
      </p>
      <p>
        The Hogwarts Express will leave from <b>Platform 9 ¾</b> at 11:00am on September 1st.
      </p>
      <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
        <button
          onClick={() => navigate("/hogwarts-supply-list")}
          style={{
            background: "#b79b5a", color: "#fff", padding: "1rem 2.2rem",
            borderRadius: "8px", fontWeight: "bold", fontSize: "1.1rem", border: "none", cursor: "pointer"
          }}
        >
          Read Supply List
        </button>
      </div>
      <div style={{ marginTop: "2.5rem", fontSize: "1rem", fontStyle: "italic", color: "#87724a" }}>
        Yours sincerely,<br />
        <b>Minerva McGonagall</b><br />
        Deputy Headmistress
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
export default HogwartsLetter;

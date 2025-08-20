import React from "react";
import { useNavigate } from "react-router-dom";

interface HogwartsLetterProps {
  character: { name: string };
}

const HogwartsLetter: React.FC<HogwartsLetterProps> = ({ character }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      maxWidth: 600,
      margin: "2rem auto",
      padding: "2.5rem",
      background: "#f5efd9",
      borderRadius: 14,
      boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
      fontFamily: "serif",
      color: "#432c15",
      border: "2px solid #b79b5a"
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
        Students shall be required to report to the chamber of reception upon arrival, the date for commencement of term being <b>September 1st</b>.
        The Hogwarts Express will leave from <b>Platform 9 ¾</b> at 11:00am. We await your owl by no later than July 31st.
      </p>
      <p>
        To prepare for your journey, you must first visit <b>Diagon Alley</b> to purchase your school supplies.
        Muggle currency may be exchanged for wizarding money at <b>Gringotts Bank</b>.
      </p>
      <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
        <button
          onClick={() => navigate("/hogwarts-supply-list")}
          style={{
            background: "#b79b5a",
            color: "#fff",
            padding: "1rem 2.2rem",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "1.1rem",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 6px #b79b5a44"
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
    </div>
  );
};

export default HogwartsLetter;

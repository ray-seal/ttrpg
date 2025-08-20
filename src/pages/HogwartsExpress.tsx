import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Character } from "../types";

// A generic friend name for use in the story
const FRIEND_NAME = "Morgan Avery";

const HogwartsExpress: React.FC<{ character: Character }> = ({ character }) => {
  const [screen, setScreen] = useState<0 | 1 | 2>(0);
  const navigate = useNavigate();

  const advance = () => setScreen(s => (s < 2 ? (s + 1) as 0 | 1 | 2 : s));

  if (screen === 0) {
    return (
      <div style={cardStyle}>
        <h2 style={titleStyle}>King's Cross Station</h2>
        <p>
          Steam billows from the scarlet engine as you weave through the crowd. With a deep breath, you dash at the barrier between platforms 9 and 10—and find yourself at Platform 9¾! You board the Hogwarts Express, heart pounding with anticipation.
        </p>
        <div style={centered}><button style={btnStyle} onClick={advance}>Find a seat</button></div>
      </div>
    );
  }
  if (screen === 1) {
    return (
      <div style={cardStyle}>
        <h2 style={titleStyle}>On the Train</h2>
        <p>
          You find an empty compartment, but soon another nervous-looking first year slides the door open. They introduce themself as <b>{FRIEND_NAME}</b>.
        </p>
        <p>
          <i>"Hi! I'm {FRIEND_NAME}. What house do you hope to be sorted into?"</i>
        </p>
        <div style={centered}><button style={btnStyle} onClick={advance}>Chat with {FRIEND_NAME}</button></div>
      </div>
    );
  }
  // Last screen: prompt to continue to sorting
  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>Arrival at Hogwarts</h2>
      <p>
        The train winds its way through the countryside. You and {FRIEND_NAME} share hopes and nerves about the Sorting Ceremony. As dusk falls, you catch your first glimpse of Hogwarts, perched atop a mountain and wreathed in mist.
      </p>
      <p>
        It's time to face the Sorting Hat!
      </p>
      <div style={centered}>
        <button
          style={btnStyle}
          onClick={() => navigate("/sorting-hat")}
        >
          Continue to the Sorting Ceremony
        </button>
      </div>
    </div>
  );
};

const cardStyle = {
  maxWidth: 600,
  margin: "3rem auto",
  padding: "2.5rem",
  background: "#f5efd9",
  borderRadius: 14,
  fontFamily: "serif",
  color: "#432c15",
  border: "2px solid #b79b5a"
};
const titleStyle = {
  fontFamily: "cursive",
  textAlign: "center",
  marginBottom: "1.5rem",
  color: "#1e1c17"
};
const btnStyle = {
  background: "#b79b5a",
  color: "#fff",
  padding: "1rem 2.2rem",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "1.1rem",
  border: "none",
  cursor: "pointer",
  marginTop: "1.5rem"
};
const centered = { textAlign: "center" };

export default HogwartsExpress;

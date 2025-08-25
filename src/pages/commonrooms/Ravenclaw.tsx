import React from "react";
import ThemedLayout from "../../components/ThemedLayout";
import { Navigate } from "react-router-dom";

const RavenclawCommonRoom = ({ character }) => {
  if (!character) return <div>Loading...</div>;
  if (character.house !== "Ravenclaw") {
    return <Navigate to="/" replace />;
  }

  return (
    <ThemedLayout character={character}>
      <h1 style={{ color: "#222f5b" }}>Ravenclaw Common Room</h1>
      <p>
        Welcome to the airy Ravenclaw tower! Share your wisdom, solve riddles, and join brainy side activities like <b>Quiz Duels</b> and <b>Mystery Puzzles</b>—exclusively for Ravenclaws.
      </p>
      <ul>
        <li>House Social Board: Discuss, debate, and discover</li>
        <li>Side Quests: Ravenclaw challenges</li>
        <li>Compete for house points with your intellect</li>
      </ul>
    </ThemedLayout>
  );
};

export default RavenclawCommonRoom;

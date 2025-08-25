import React from "react";
import ThemedLayout from "../../components/ThemedLayout";
import { Navigate } from "react-router-dom";

const SlytherinCommonRoom = ({ character }) => {
  if (!character) return <div>Loading...</div>;
  if (character.house !== "Slytherin") {
    return <Navigate to="/" replace />;
  }

  return (
    <ThemedLayout character={character}>
      <h1 style={{ color: "#2a623d" }}>Slytherin Common Room</h1>
      <p>
        Welcome to the shadowy, sophisticated Slytherin dungeon! Strategize with cunning classmates and launch exclusive side quests like <b>Prank Wars</b> and <b>Secret Alliances</b> to outwit your rivals.
      </p>
      <ul>
        <li>House Social Board: Plot, plan, and network</li>
        <li>Side Quests: Slytherin-only schemes</li>
        <li>Outsmart the other houses for the Cup</li>
      </ul>
    </ThemedLayout>
  );
};

export default SlytherinCommonRoom;

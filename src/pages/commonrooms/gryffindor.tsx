import React from "react";
import ThemedLayout from "../../components/ThemedLayout";
import { Navigate } from "react-router-dom";

const GryffindorCommonRoom = ({ character }) => {
  if (!character) return <div>Loading...</div>;
  if (character.house !== "Gryffindor") {
    return <Navigate to="/" replace />;
  }

  return (
    <ThemedLayout character={character}>
      <h1 style={{ color: "#ae0001" }}>Gryffindor Common Room</h1>
      <p>
        Welcome to the cozy, lively Gryffindor Tower! Here, you can chat with fellow lions, share stories of bravery, and join house-only side quests like <b>Capture the Flag</b> or <b>Prank Wars</b> against Slytherin.
      </p>
      <ul>
        <li>House Social Board: Post, chat, and plan mischief</li>
        <li>Side Quests: Only for Gryffindors!</li>
        <li>Team up for bonus house points</li>
      </ul>
    </ThemedLayout>
  );
};

export default GryffindorCommonRoom;

import React from "react";
import ThemedLayout from "../../components/ThemedLayout";
import { Navigate } from "react-router-dom";

const HufflepuffCommonRoom = ({ character }) => {
  if (!character) return <div>Loading...</div>;
  if (character.house !== "Hufflepuff") {
    return <Navigate to="/" replace />;
  }

  return (
    <ThemedLayout character={character}>
      <h1 style={{ color: "#ecb939" }}>Hufflepuff Common Room</h1>
      <p>
        Welcome to the cheerful Hufflepuff basement! Here, loyal badgers gather to support each other, swap tips for success, and embark on exclusive Hufflepuff adventures like <b>Teamwork Challenges</b> and <b>Kindness Drives</b>.
      </p>
      <ul>
        <li>House Social Board: Collaborate and make friends</li>
        <li>Side Quests: Hufflepuff-only opportunities</li>
        <li>Help the house win the Cup through teamwork</li>
      </ul>
    </ThemedLayout>
  );
};

export default HufflepuffCommonRoom;

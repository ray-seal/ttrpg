import React from "react";
import { houseThemes, House } from "../themes";
import HouseShield from "./HouseShield";
import { Character } from "../types";

interface ThemedLayoutProps {
  character: Character;
  children: React.ReactNode;
}

const ThemedLayout: React.FC<ThemedLayoutProps> = ({ character, children }) => {
  const theme = houseThemes[character.house as House] ?? houseThemes.Gryffindor;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.background,
        color: theme.primary,
        fontFamily: "monospace",
        position: "relative",
      }}
    >
      <HouseShield house={character.house as House} />
      <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default ThemedLayout;

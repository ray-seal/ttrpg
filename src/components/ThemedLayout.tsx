import React from "react";
import { houseThemes, House } from "../themes";
import { Character } from "../types";

// Neutral/default theme for unsorted students
const defaultTheme = {
  primary: "#423d35",
  secondary: "#423d35",
  accent: "#a0a0a0",
  background: "#f5f5f5",
  shield: "Hogwarts-Crest.png", // Use the official Hogwarts Crest for unsorted
};

const getShieldURL = (house: House | "Neutral") =>
  house && houseThemes[house]
    ? `/assets/shields/${houseThemes[house].shield}`
    : `/assets/shields/${defaultTheme.shield}`;

interface ThemedLayoutProps {
  character: Character;
  children: React.ReactNode;
}

export const boxStyle = (theme: typeof houseThemes.Gryffindor | typeof defaultTheme) => ({
  maxWidth: 700,
  margin: "2rem auto",
  padding: "2.5rem",
  background: `${theme.primary}99`, // 0.6 opacity in hex
  borderRadius: 14,
  fontFamily: "serif",
  color: theme.secondary,
  border: `2px solid ${theme.accent}`,
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.08)",
  position: "relative",
  zIndex: 2,
});

const ThemedLayout: React.FC<ThemedLayoutProps> = ({ character, children }) => {
  const hasHouse = Boolean(character.house && houseThemes[character.house as House]);
  const theme = hasHouse ? houseThemes[character.house as House] : defaultTheme;
  const shieldUrl = hasHouse
    ? getShieldURL(character.house as House)
    : `/assets/shields/${defaultTheme.shield}`;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.background,
        color: theme.primary,
        fontFamily: "monospace",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Big faded shield in background */}
      <img
        src={shieldUrl}
        alt={hasHouse ? `${character.house} shield` : "Hogwarts crest"}
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 480,
          height: 480,
          opacity: 0.10,
          zIndex: 0,
          pointerEvents: "none",
          userSelect: "none",
        }}
        draggable={false}
      />
      {/* Main content box */}
      <div style={boxStyle(theme)}>
        {children}
      </div>
    </div>
  );
};

export default ThemedLayout;

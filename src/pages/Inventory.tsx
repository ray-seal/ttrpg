import React from "react";
import ThemedLayout from "../components/ThemedLayout";
import { Character } from "../types";
import { useNavigate } from "react-router-dom";
import { houseThemes, House } from "../themes";

type InventoryItem = {
  id: string;
  name: string;
  description?: string;
  quantity?: number;
};

type InventoryProps = {
  character: Character;
  inventory: InventoryItem[];
};

const Inventory: React.FC<InventoryProps> = ({ character, inventory }) => {
  const theme = houseThemes[character.house as House];
  const navigate = useNavigate();

  return (
    <ThemedLayout character={character}>
      <h2
        style={{
          fontFamily: "cursive",
          textAlign: "center",
          marginBottom: "1.8rem",
          color: theme.secondary
        }}
      >
        Inventory
      </h2>
      {inventory.length === 0 ? (
        <div style={{ textAlign: "center", color: theme.secondary }}>
          Your inventory is empty.
        </div>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {inventory.map((item) => (
            <li
              key={item.id}
              style={{
                background: `${theme.background}99`,
                marginBottom: "1.2rem",
                padding: "1rem 1.2rem",
                borderRadius: "10px",
                border: `1.5px solid ${theme.accent}`,
                color: theme.primary,
                boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                fontFamily: "serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                opacity: 0.95,
              }}
            >
              <span>
                <b>{item.name}</b>
                {item.quantity ? <> &times;{item.quantity}</> : null}
                {item.description ? (
                  <span style={{ fontStyle: "italic", marginLeft: 8, color: theme.secondary }}>
                    — {item.description}
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: theme.accent,
            color: theme.primary,
            padding: "0.8rem 2rem",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          Back to Home
        </button>
      </div>
    </ThemedLayout>
  );
};

export default Inventory;

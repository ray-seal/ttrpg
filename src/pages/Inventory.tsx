import React, { useEffect, useState } from "react";
import ThemedLayout from "../components/ThemedLayout";
import { Character } from "../types";
import { useNavigate } from "react-router-dom";
import { houseThemes, House } from "../themes";
import { supabase } from "../supabaseClient";

type InventoryItem = {
  id: string;
  name: string;
  description?: string;
};

type CharacterItem = {
  id: string;
  character_id: string;
  item_id: string;
  quantity: number;
  items: InventoryItem | null;
};

type InventoryProps = {
  character: Character;
};

const Inventory: React.FC<InventoryProps> = ({ character }) => {
  const [inventory, setInventory] = useState<CharacterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Note: theme is only used for the back button color
  const theme = houseThemes[character.house as House] || houseThemes.Gryffindor;

  useEffect(() => {
    if (!character.id) return;
    setLoading(true);
    supabase
      .from("character_items")
      .select(`
        id,
        character_id,
        item_id,
        quantity,
        items (
          id,
          name,
          description
        )
      `)
      .eq("character_id", character.id)
      .then(({ data, error }) => {
        setInventory(data || []);
        setLoading(false);
      });
  }, [character.id]);

  return (
    <ThemedLayout character={character}>
      <h2
        style={{
          fontFamily: "cursive",
          textAlign: "center",
          marginBottom: "1.8rem",
          color: "#000",
        }}
      >
        Inventory
      </h2>
      {/* <pre style={{fontSize:12, background:"#eee", color:"#000", overflowX:"auto"}}>{JSON.stringify(inventory, null, 2)}</pre> */}
      {loading ? (
        <div style={{ textAlign: "center", color: "#000", fontWeight: 600 }}>Loading...</div>
      ) : inventory.length === 0 ? (
        <div style={{ textAlign: "center", color: "#000", fontWeight: 600 }}>
          Your inventory is empty.
        </div>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {inventory
            .filter((ci) => ci.items && ci.quantity > 0)
            .map((ci) => (
              <li
                key={ci.id}
                style={{
                  background: "#fff",
                  marginBottom: "1.2rem",
                  padding: "1rem 1.2rem",
                  borderRadius: "10px",
                  border: `1.5px solid ${theme.accent}`,
                  color: "#000",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
                  fontFamily: "serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  opacity: 0.98,
                  fontWeight: 600
                }}
              >
                <span>
                  <b>{ci.items?.name || "Unknown Item"}</b>
                  {ci.quantity ? <> &times;{ci.quantity}</> : null}
                  {ci.items?.description ? (
                    <span style={{ fontStyle: "italic", marginLeft: 8, color: "#000" }}>
                      — {ci.items.description}
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
            color: "#000",
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

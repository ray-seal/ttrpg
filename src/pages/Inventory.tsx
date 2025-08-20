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
  quantity?: number;
};

type CharacterItem = {
  id: string;
  character_id: string;
  item_id: string;
  quantity: number;
  items: InventoryItem | null; // from joined 'items'
};

type InventoryProps = {
  character: Character;
};

const Inventory: React.FC<InventoryProps> = ({ character }) => {
  const [inventory, setInventory] = useState<CharacterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = houseThemes[character.house as House];
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchInventory() {
      setLoading(true);

      // Join character_items with items to get details
      const { data, error } = await supabase
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
        .eq("character_id", character.id);

      if (!error && data) {
        setInventory(data);
      } else {
        setInventory([]);
      }
      setLoading(false);
    }
    fetchInventory();
  }, [character.id]);

  return (
    <ThemedLayout character={character}>
      <h2
        style={{
          fontFamily: "cursive",
          textAlign: "center",
          marginBottom: "1.8rem",
          color: theme.secondary,
          textShadow: "0 2px 8px #fff"
        }}
      >
        Inventory
      </h2>
      {loading ? (
        <div style={{ textAlign: "center", color: theme.primary, fontWeight: 600 }}>Loading...</div>
      ) : inventory.length === 0 ? (
        <div style={{ textAlign: "center", color: theme.primary, fontWeight: 600 }}>
          Your inventory is empty.
        </div>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {inventory.map((ci) => (
            <li
              key={ci.id}
              style={{
                background: "#fff",
                marginBottom: "1.2rem",
                padding: "1rem 1.2rem",
                borderRadius: "10px",
                border: `1.5px solid ${theme.accent}`,
                color: theme.primary,
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
                  <span style={{ fontStyle: "italic", marginLeft: 8, color: theme.secondary }}>
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

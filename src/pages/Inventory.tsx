import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Character } from "../types";

interface Item {
  id: string;
  name: string;
  description: string;
  effect?: string;
  unlock_level?: number;
}

interface InventoryProps {
  character: Character;
}

const Inventory: React.FC<InventoryProps> = ({ character }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchInventory() {
      setLoading(true);
      // Join character_items to items
      const { data, error } = await supabase
        .from("character_items")
        .select("item:items(id, name, description, effect, unlock_level)")
        .eq("character_id", character.id);
      if (error) {
        setItems([]);
      } else {
        // data is an array of { item: { ... } }
        setItems(data.map((row: any) => row.item));
      }
      setLoading(false);
    }
    if (character.id) fetchInventory();
  }, [character.id]);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading Inventory...</div>;
  }

  return (
    <div style={{
      maxWidth: 600,
      margin: "2rem auto",
      padding: "2rem",
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
      fontFamily: "serif"
    }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Inventory</h2>
      {items.length === 0 ? (
        <div style={{ color: "#888" }}>No items yet.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {items.map((item) => (
            <li key={item.id} style={{ marginBottom: "1.2rem" }}>
              <div style={{ fontWeight: "bold", fontSize: "1.1em" }}>{item.name}</div>
              <div style={{ color: "#333", marginBottom: "0.3em" }}>{item.description}</div>
              {item.effect && (
                <div style={{ color: "#2d6a4f", fontStyle: "italic" }}>Effect: {item.effect}</div>
              )}
              {item.unlock_level && (
                <div style={{ color: "#764abc" }}>Unlock Level: {item.unlock_level}</div>
              )}
            </li>
          ))}
        </ul>
      )}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "#4287f5",
            color: "#fff",
            padding: "0.75rem 2rem",
            borderRadius: "8px",
            border: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Inventory;

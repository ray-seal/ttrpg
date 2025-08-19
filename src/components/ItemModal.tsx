import React from "react";

interface ItemModalProps {
  items: string[];
  onUseItem: (item: string) => void;
  onClose: () => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ items, onUseItem, onClose }) => (
  <div
    style={{
      position: "fixed",
      left: 0,
      top: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(240,230,200,0.96)",
      zIndex: 3001,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <div style={{ background: "#fffbe9", padding: "2em", borderRadius: 16, border: "2px solid #d3c56b" }}>
      <h3>Items</h3>
      {items.length === 0 && <div>No items found.</div>}
      {items.map(item => (
        <div key={item} style={{ margin: "1em 0" }}>
          {item}
          <button
            style={{ marginLeft: "1em", padding: "0.4em 1em", borderRadius: 8 }}
            onClick={() => onUseItem(item)}
          >
            Use
          </button>
        </div>
      ))}
      <button
        style={{
          marginTop: "1em",
          padding: "0.6em 1.5em",
          borderRadius: "8px",
          background: "#b7e4c7",
          color: "#333",
          border: "none",
          fontWeight: "bold",
          fontSize: "1.08em"
        }}
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
);

export default ItemModal;

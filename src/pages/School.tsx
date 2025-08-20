import React from "react";
import { Character } from "../types";
import { Link } from "react-router-dom";

const School: React.FC<{
  character: Character;
  setCharacter: (c: Character) => void;
}> = ({ character }) => {
  return (
    <div style={{
      maxWidth: 700,
      margin: "2rem auto",
      padding: "2.5rem",
      background: "#f5efd9",
      borderRadius: 14,
      fontFamily: "serif",
      color: "#432c15",
      border: "2px solid #b79b5a",
    }}>
      <h2 style={{
        fontFamily: "cursive",
        textAlign: "center",
        marginBottom: "1.8rem",
        color: "#1e1c17"
      }}>
        Hogwarts School
      </h2>
      <p>
        Welcome to Hogwarts, {character.name}! Your magical education begins here. Attend classes, meet professors, make friends, and discover secrets hidden within the castle's ancient walls.
      </p>

      <h3 style={{ marginTop: "2rem", marginBottom: "0.7rem" }}>Key Locations</h3>
      <ul>
        <li>
          <b>Owlery</b> <span style={{ color: "#b79b5a" }}>(coming soon)</span>
        </li>
        <li>
          <b>Common Room</b> <span style={{ color: "#b79b5a" }}>(coming soon)</span>
        </li>
        <li>
          <b>Great Hall</b> <span style={{ color: "#b79b5a" }}>(coming soon)</span>
        </li>
      </ul>

      <h3 style={{ marginTop: "2rem", marginBottom: "0.7rem" }}>Classes</h3>
      <ul>
        <li>
          <b>Charms</b>
          <ul style={{ marginTop: "0.5rem" }}>
            <li>
              <Link to="/charms/alohomora" style={{ color: "#4287f5", textDecoration: "none" }}>
                Alohomora
              </Link>
            </li>
            <li>
              <Link to="/charms/wingardium-leviosa" style={{ color: "#4287f5", textDecoration: "none" }}>
                Wingardium Leviosa
              </Link>
            </li>
            <li>
              <Link to="/charms/lumos" style={{ color: "#4287f5", textDecoration: "none" }}>
                Lumos
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <b>Transfiguration</b> <span style={{ color: "#b79b5a" }}>(coming soon)</span>
        </li>
        <li>
          <b>Potions</b> <span style={{ color: "#b79b5a" }}>(coming soon)</span>
        </li>
        <li>
          <b>Defence Against the Dark Arts</b> <span style={{ color: "#b79b5a" }}>(coming soon)</span>
        </li>
        <li>
          <b>Herbology</b> <span style={{ color: "#b79b5a" }}>(coming soon)</span>
        </li>
        <li>
          <b>Care of Magical Creatures</b> <span style={{ color: "#b79b5a" }}>(coming soon)</span>
        </li>
      </ul>

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <span role="img" aria-label="castle" style={{ fontSize: "2.5rem" }}>🏰</span>
      </div>
    </div>
  );
};

export default School;

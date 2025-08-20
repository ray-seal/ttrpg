import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Character } from "../types";

interface HomePageProps {
  hasCharacter: boolean;
  character?: Character | null;
  session: any;
}

const HomePage: React.FC<HomePageProps> = ({ hasCharacter, character, session }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: `url("/assets/shields/Hogwarts-Crest.png") center/350px no-repeat, #f7f7f7`,
        fontFamily: "monospace",
        position: "relative",
      }}
    >
      <h1
        style={{
          marginBottom: "2rem",
          background: "rgba(255,255,255,0.7)",
          borderRadius: "12px",
          padding: "0.5rem",
        }}
      >
        Harry Potter TTRPG
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          minWidth: "220px",
        }}
      >
        {session && hasCharacter && (
          <>
            <Link
              to="/character-sheet"
              style={{
                background: "#4287f5",
                color: "#fff",
                padding: "1rem",
                borderRadius: "8px",
                textAlign: "center",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              Character Sheet
            </Link>
            <button
              onClick={() => navigate("/inventory")}
              style={{
                background: "#6b41a1",
                color: "#fff",
                padding: "1rem",
                borderRadius: "8px",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.1rem",
                border: "none",
                cursor: "pointer",
                marginBottom: "0.5rem",
              }}
            >
              Inventory
            </button>
          </>
        )}
        {session && !hasCharacter && (
          <Link
            to="/character-creation"
            style={{
              background: "#4287f5",
              color: "#fff",
              padding: "1rem",
              borderRadius: "8px",
              textAlign: "center",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            Create Character
          </Link>
        )}
        <Link
          to="/school"
          style={{
            background: "#7b2d26",
            color: "#fff",
            padding: "1rem",
            borderRadius: "8px",
            textAlign: "center",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1.1rem",
            marginTop: "1rem",
          }}
        >
          School
        </Link>
      </div>
      {!session && (
        <div style={{ position: "fixed", bottom: 24, left: 0, width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link
              to="/signup"
              style={{
                background: "#4287f5",
                color: "#fff",
                padding: "0.75rem 2rem",
                borderRadius: "8px",
                textAlign: "center",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              }}
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              style={{
                background: "#4287f5",
                color: "#fff",
                padding: "0.75rem 2rem",
                borderRadius: "8px",
                textAlign: "center",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

import React from "react";
import { Link } from "react-router-dom";

interface HomePageProps {
    hasCharacter: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ hasCharacter }) => (
    <div style={{
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
        <h1 style={{ marginBottom: "2rem",
            background: "rgba(255,255,255,0.7)",
            borderRadius: "12px",
            padding: "0.5rem"
         }}>Harry Potter TTRPG</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: "220px" }}>
            {hasCharacter && (
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
                    fontSize: "1.1rem"
                }}
                >
                    Character Sheet
                </Link>
            )}
            {!hasCharacter && (
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
                    fontSize: "1.1rem"
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
                marginTop: "1rem"
            }}
            >
                Classes
            </Link>
            <Link
            to="/campaign"
            style={{
                background: "#d3c56b",
                color: "#333",
                padding: "1rem",
                borderRadius: "8px",
                textAlign: "center",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "1.1rem"
            }}
            >
                Campaign
            </Link>
            <Link
            to="/help"
            style={{
                background: "#b7e4c7",
                color: "#333",
                padding: "1rem",
                borderRadius: "8px",
                textAlign: "center",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "1.1rem"
            }}
            >
                Help (Coming Soon)
            </Link>
        </div>
    </div>
);

export default HomePage;

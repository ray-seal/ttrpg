import React from "react";
import { Link } from "react-router-dom";

const School: React.FC = () => (
    <div style={{
        background: "#f4efe8",
        color: "#222",
        padding: "2rem",
        borderRadius: "16px",
        maxWidth: "500px",
        margin: "3rem auto",
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        fontFamily: "serif",
        textAlign: "center",
    }}>
        <h2>Hogwarts School Lessons</h2>
        <p>Select a lesson to begin:
    </p>
    <div style={{ margin: "1.5rem 0" }}>
        <Link
        to="/school/alohomora-lesson"
        style={{
            display: "inline-block",
            background: "#7B2D26",
            color: "#fff",
            padding: "1rem 2rem",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "1.1rem",
            textDecoration: "none",
            margin: "0.5rem"
        }}
        >
            First Lesson: Alohomora
        </Link>
    </div>
    </div>
);

export default School;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface HomePageProps {
  hasCharacter: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ hasCharacter }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check and set session
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) setSession(data.session);
      setLoading(false);
      // Remove this redirect, so user always sees homepage even if not logged in
      // if (!data.session) {
      //   navigate("/signup", { replace: true });
      // }
    });
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "monospace"
      }}>
        <h2>Loading Hogwarts Adventure...</h2>
      </div>
    );
  }

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
      {/* Always show sign up/sign in at bottom */}
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
    </div>
  );
};

export default HomePage;

import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      // Optionally fetch the character and redirect
      navigate("/campaign");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg,#e7e0c9 0%,#b5c99a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div style={{
        background: "rgba(255,255,255,0.98)",
        boxShadow: "0 6px 36px rgba(0,0,0,0.13)",
        borderRadius: 18,
        padding: "2.2rem 2.5rem",
        maxWidth: 390,
        width: "100%",
        textAlign: "center"
      }}>
        <h2 style={{ fontFamily: "serif", color: "#2e5e18" }}>Log In to Hogwarts</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            required
            value={email}
            autoComplete="email"
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{
              width: "90%",
              fontSize: "1.08em",
              padding: "0.6em",
              borderRadius: 8,
              border: "1.5px solid #c2b280",
              marginBottom: 10
            }}
          />
          <input
            type="password"
            required
            value={password}
            autoComplete="current-password"
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              width: "90%",
              fontSize: "1.08em",
              padding: "0.6em",
              borderRadius: 8,
              border: "1.5px solid #c2b280",
              marginBottom: 16
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "94%",
              padding: "0.8em",
              borderRadius: 8,
              border: "none",
              background: "#6741d9",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1.1em",
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: 8
            }}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        {error && <div style={{ color: "#b91c1c", marginTop: 8 }}>{error}</div>}
        <div style={{ marginTop: 18 }}>
          <span style={{ color: "#333" }}>Don&apos;t have an account? </span>
          <a href="/signup" style={{ color: "#7cb518", fontWeight: "bold", textDecoration: "underline" }}>Sign up here</a>
        </div>
      </div>
    </div>
  );
}

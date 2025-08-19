import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";

const ticketImg =
  "https://upload.wikimedia.org/wikipedia/commons/3/35/Hogwarts_Express_ticket.png"; // or your own asset

type Step = "intro" | "gender" | "story" | "signup" | "ticket";

export default function AuthWizard() {
  const [step, setStep] = useState<Step>("intro");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handles moving to the next step (with validation)
  const handleNext = async () => {
    if (step === "intro") {
      if (!name) return setError("Please enter your name.");
      setError(null);
      setStep("gender");
    } else if (step === "gender") {
      if (!gender) return setError("Please select a gender.");
      setError(null);
      setStep("story");
    } else if (step === "story") {
      setStep("signup");
    }
  };

  // Handles signup and user/character creation
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Supabase sign up
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, gender } },
    });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    // Insert starting character row
    const user = data.user;
    if (user) {
      await supabase.from("characters").insert([
        {
          user_id: user.id,
          name,
          house: null,
          experience: 0,
          level: 1,
          magic: 0,
          knowledge: 0,
          courage: 0,
          agility: 0,
          charisma: 0,
          hit_points: 10,
          scene_id: "wakeup",
        },
      ]);
    }
    setLoading(false);
    setStep("ticket");
    setTimeout(() => navigate("/campaign"), 3500); // auto-redirect after ticket
  };

  // Wizard-like stepper UI
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg,#e7e0c9 0%,#b5c99a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.98)",
          boxShadow: "0 6px 36px rgba(0,0,0,0.13)",
          borderRadius: 18,
          padding: "2.2rem 2.5rem",
          maxWidth: 390,
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Steps */}
        {step === "intro" && (
          <>
            <h2 style={{ fontFamily: "serif", color: "#2e5e18" }}>
              Welcome, young witch or wizard!
            </h2>
            <p style={{ fontSize: "1.15em" }}>What is your name?</p>
            <input
              style={{
                width: "90%",
                fontSize: "1.1em",
                padding: "0.6em",
                borderRadius: 8,
                border: "1.5px solid #c2b280",
                marginBottom: 10,
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type your name..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNext();
              }}
            />
            <br />
            <button
              onClick={handleNext}
              style={{
                marginTop: 10,
                padding: "0.7em 2.2em",
                borderRadius: 8,
                border: "none",
                background: "#7cb518",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.1em",
                cursor: "pointer",
              }}
            >
              Continue
            </button>
            <div style={{ marginTop: 18 }}>
              <span style={{ color: "#333" }}>Already have an account? </span>
              <Link
                to="/login"
                style={{
                  color: "#7cb518",
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                Sign in here
              </Link>
            </div>
          </>
        )}

        {step === "gender" && (
          <>
            <h2 style={{ fontFamily: "serif", color: "#2e5e18" }}>
              Hello, {name}!
            </h2>
            <p style={{ fontSize: "1.13em", marginBottom: 16 }}>
              How do you identify?
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <button
                style={{
                  padding: "0.7em 1.8em",
                  borderRadius: 8,
                  border:
                    gender === "female"
                      ? "2.5px solid #bc4749"
                      : "1.5px solid #c2b280",
                  background: gender === "female" ? "#ffe5ec" : "#f5f1e6",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => setGender("female")}
              >
                Girl
              </button>
              <button
                style={{
                  padding: "0.7em 1.8em",
                  borderRadius: 8,
                  border:
                    gender === "male"
                      ? "2.5px solid #386641"
                      : "1.5px solid #c2b280",
                  background: gender === "male" ? "#caffbf" : "#f5f1e6",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => setGender("male")}
              >
                Boy
              </button>
              <button
                style={{
                  padding: "0.7em 1.8em",
                  borderRadius: 8,
                  border:
                    gender === "other"
                      ? "2.5px solid #0096c7"
                      : "1.5px solid #c2b280",
                  background: gender === "other" ? "#e0fbfc" : "#f5f1e6",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => setGender("other")}
              >
                Other
              </button>
            </div>
            <button
              onClick={handleNext}
              style={{
                padding: "0.7em 2.2em",
                borderRadius: 8,
                border: "none",
                background: "#7cb518",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.1em",
                cursor: "pointer",
              }}
            >
              Continue
            </button>
          </>
        )}

        {step === "story" && (
          <>
            <h2 style={{ fontFamily: "serif", color: "#2e5e18" }}>
              Dear {name},
            </h2>
            <p
              style={{
                fontFamily: "serif",
                fontSize: "1.13em",
                color: "#2d2d2d",
                lineHeight: 1.5,
                marginTop: 10,
              }}
            >
              You are an ordinary 11 year old muggle… or so you thought.<br />
              <br />
              One day, an owl arrives with a curious envelope. You are a{" "}
              <b>
                {gender === "female"
                  ? "witch"
                  : gender === "male"
                  ? "wizard"
                  : "witch or wizard"}
              </b>
              !<br />
              <br />
              Inside is your <b>letter of acceptance to Hogwarts School of Witchcraft and Wizardry</b>. Your magical adventure is about to begin...
            </p>
            <button
              onClick={handleNext}
              style={{
                marginTop: 16,
                padding: "0.7em 2.2em",
                borderRadius: 8,
                border: "none",
                background: "#7cb518",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.1em",
                cursor: "pointer",
              }}
            >
              Go to Sign Up
            </button>
          </>
        )}

        {step === "signup" && (
          <form onSubmit={handleSignup}>
            <h2 style={{ fontFamily: "serif", color: "#2e5e18" }}>
              Sign Up for Hogwarts
            </h2>
            <input
              type="email"
              required
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: "90%",
                fontSize: "1.08em",
                padding: "0.6em",
                borderRadius: 8,
                border: "1.5px solid #c2b280",
                marginBottom: 10,
              }}
            />
            <input
              type="password"
              required
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              style={{
                width: "90%",
                fontSize: "1.08em",
                padding: "0.6em",
                borderRadius: 8,
                border: "1.5px solid #c2b280",
                marginBottom: 16,
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
                marginBottom: 8,
              }}
            >
              {loading ? "Enrolling..." : "Sign Up"}
            </button>
            {error && (
              <div style={{ color: "#b91c1c", marginTop: 8 }}>{error}</div>
            )}
          </form>
        )}

        {step === "ticket" && (
          <div>
            <h2 style={{ fontFamily: "serif", color: "#2e5e18" }}>
              Welcome to the Wizarding World!
            </h2>
            <img
              src={ticketImg}
              alt="Hogwarts Express Ticket"
              style={{
                width: "95%",
                maxWidth: 320,
                borderRadius: 12,
                margin: "1.2em auto 1.8em auto",
                boxShadow: "0 4px 22px rgba(0,0,0,0.13)",
              }}
            />
            <div
              style={{
                fontFamily: "serif",
                fontSize: "1.14em",
                color: "#2e5e18",
                marginBottom: 4,
              }}
            >
              Your wizarding journey begins here...
            </div>
            <div
              style={{
                fontSize: "0.96em",
                color: "#333",
                opacity: 0.8,
                marginTop: 10,
              }}
            >
              Redirecting to Hogwarts... 🧙‍♂️
            </div>
          </div>
        )}
        {error && step !== "signup" && (
          <div style={{ color: "#b91c1c", marginTop: 12 }}>{error}</div>
        )}
      </div>
    </div>
  );
}

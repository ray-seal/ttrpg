import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const houseList = ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"];

const CharacterCreation: React.FC<{ userId: string; onCreate: (c: any) => void; }> = ({ userId, onCreate }) => {
  const [step, setStep] = useState<"name" | "sorting" | "done">("name");
  const [name, setName] = useState("");
  const [sortingResult, setSortingResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  function randomHouse() {
    const idx = Math.floor(Math.random() * houseList.length);
    return houseList[idx];
  }

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStep("sorting");
  };

  const handleSort = async () => {
    const house = randomHouse();
    setSortingResult(house);
    // Create character in DB with 0 wizarding_money and no items
    const { data, error } = await supabase
      .from("characters")
      .insert([{ name, house, user_id: userId, wizarding_money: 0 }])
      .select()
      .single();
    if (error || !data) {
      setError("Could not create character.");
      return;
    }
    // Callback for parent
    onCreate(data);
    setStep("done");
    setTimeout(() => navigate("/hogwarts-letter"), 1500);
  };

  if (step === "name") {
    return (
      <form onSubmit={handleNameSubmit} style={{ textAlign: "center", marginTop: "4rem" }}>
        <h2>What is your name?</h2>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
          style={{ fontSize: "1.2rem", padding: "0.6rem", borderRadius: 8 }}
        />
        <br />
        <button type="submit" style={{ marginTop: "1.5rem", fontSize: "1.1em" }}>
          Continue
        </button>
      </form>
    );
  }
  if (step === "sorting") {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <h2>The Sorting Hat is thinking...</h2>
        {!sortingResult ? (
          <button onClick={handleSort} style={{ marginTop: 32, fontSize: "1.2em" }}>Reveal my house!</button>
        ) : (
          <h2 style={{ marginTop: 32 }}>Welcome to <span style={{ color: "#b79b5a" }}>{sortingResult}!</span></h2>
        )}
        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </div>
    );
  }
  if (step === "done") {
    return (
      <div style={{ textAlign: "center", marginTop: "6rem", fontSize: "1.3em" }}>
        Your adventure begins...
      </div>
    );
  }
  return null;
};
export default CharacterCreation;

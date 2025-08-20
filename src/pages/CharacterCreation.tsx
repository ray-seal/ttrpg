import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Character, House } from "../types";

// You can set default spells by their spell_id or key
const DEFAULT_STARTING_SPELLS: string[] = []; // Example: ['alohomora', 'lumos']

const DEFAULT_ATTRIBUTE = 5;
const STARTING_POINTS = 5;
const BONUS = 1;

const houseByChoice: Record<string, House> = {
  success: "Hufflepuff",
  courage: "Gryffindor",
  intelligence: "Ravenclaw",
  power: "Slytherin",
};
const attributeByHouse: Record<House, keyof Character> = {
  Gryffindor: "courage",
  Hufflepuff: "charisma",
  Ravenclaw: "knowledge",
  Slytherin: "magic",
};

interface CharacterCreationProps {
  userId: string;
  characters: Character[];
  onCreate: (character: Character) => void;
  onSelectCharacter: (characterId: string) => void;
}

const placeholderStudents = [
  { name: "Susan Bones", house: "Hufflepuff" },
  { name: "Terry Boot", house: "Ravenclaw" },
  { name: "Blaise Zabini", house: "Slytherin" },
  { name: "Lavender Brown", house: "Gryffindor" }
];

const CharacterCreation: React.FC<CharacterCreationProps> = ({
  userId,
  characters,
  onCreate,
  onSelectCharacter,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState("");
  const [chosenWord, setChosenWord] = useState<"success" | "courage" | "intelligence" | "power" | null>(null);
  const [house, setHouse] = useState<House | "">("");
  const [attributes, setAttributes] = useState({
    magic: DEFAULT_ATTRIBUTE,
    knowledge: DEFAULT_ATTRIBUTE,
    courage: DEFAULT_ATTRIBUTE,
    agility: DEFAULT_ATTRIBUTE,
    charisma: DEFAULT_ATTRIBUTE,
  });
  const [pointsLeft, setPointsLeft] = useState(STARTING_POINTS);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Autofill name from user profile (if available)
  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.user_metadata && user.user_metadata.name) {
          setName(user.user_metadata.name);
          setStep(2);
        }
      } catch {
        // ignore
      }
    }
    fetchUserData();
  }, []);

  // Give house bonus exactly once
  useEffect(() => {
    if (house && step === 3) {
      const attr = attributeByHouse[house as House];
      setAttributes(prev => ({
        ...prev,
        [attr]: prev[attr] + BONUS,
      }));
    }
    // eslint-disable-next-line
  }, [house, step]);

  // Character limit
  const reachedCharacterLimit = characters.length >= 4;

  // Step 1: Enter name or show character limit
  if (step === 1) {
    return (
      <div style={{
        background: "#f7f7f7",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        minWidth: "320px",
        margin: "2rem auto"
      }}>
        <h2 style={{ textAlign: "center" }}>Create Your Character</h2>
        {reachedCharacterLimit ? (
          <div style={{ color: "#b91c1c", marginBottom: "1.5rem", textAlign: "center" }}>
            <strong>You already have 4 characters.</strong>
            <div>Please delete a character or switch to another to create a new one.</div>
            <div style={{ marginTop: "1.2rem" }}>
              {characters.map(char => (
                <button
                  key={char.id}
                  style={{
                    margin: "0.3rem",
                    padding: "0.6rem 1.1rem",
                    borderRadius: "8px",
                    background: "#ececec",
                    border: "1px solid #bbb",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                  onClick={() => onSelectCharacter(char.id)}
                >
                  Switch to {char.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  padding: "0.75rem",
                  fontSize: "1.1rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  width: "80%",
                  marginBottom: "1rem"
                }}
                onKeyDown={e => { if (e.key === "Enter" && name.trim()) setStep(2); }}
                disabled={!!name}
              />
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "1.1rem",
                background: name.trim() ? "#4287f5" : "#eee",
                color: name.trim() ? "#fff" : "#999",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: name.trim() ? "pointer" : "not-allowed"
              }}
            >
              Continue
            </button>
          </>
        )}
      </div>
    );
  }

  // Step 2: Sorting Hat Poem
  if (step === 2) {
    return (
      <div style={{
        background: "#fcf6e6",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
        minWidth: "320px",
        margin: "2rem auto",
        fontFamily: "serif"
      }}>
        <div style={{ fontSize: "1.18rem", marginBottom: "1.8rem" }}>
          <p>
            Professor McGonagall enters the hall with a three legged stool and places a dusty old hat on top of it. The hem opens and a voice erupts from the hat:
          </p>
          <p style={{ fontStyle: "italic", lineHeight: 1.7 }}>
            "Come forth young wizards, come forth young witches. I will tell you the house that will take you to educational riches. Do you seek{" "}
            <TappableWord word="success" onSelect={w => { setChosenWord(w); setTimeout(() => setStep(3), 600); }} />
            {" "}or{" "}
            <TappableWord word="courage" onSelect={w => { setChosenWord(w); setTimeout(() => setStep(3), 600); }} />
            {" "}or{" "}
            <TappableWord word="intelligence" onSelect={w => { setChosenWord(w); setTimeout(() => setStep(3), 600); }} />
            {" "}or{" "}
            <TappableWord word="power" onSelect={w => { setChosenWord(w); setTimeout(() => setStep(3), 600); }} />
            {" "}when I touch your head, you shall know in the hour."
          </p>
          <p style={{ fontSize: "0.95em", color: "#888", marginTop: "1.2em" }}>
            (Tap a word to answer)
          </p>
        </div>
      </div>
    );
  }

  // Step 3: Sorting Ceremony
  if (step === 3 && chosenWord && name) {
    const sortedHouse = houseByChoice[chosenWord];
    if (house !== sortedHouse) setHouse(sortedHouse);

    const attrLabel = {
      success: "charisma",
      courage: "courage",
      intelligence: "knowledge",
      power: "magic"
    }[chosenWord];

    return (
      <div style={{
        background: "#f7f7f7",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
        minWidth: "340px",
        margin: "2rem auto",
        fontFamily: "serif"
      }}>
        <div>
          <p>
            Professor McGonagall pulls out her scroll. "When I call your name, step forward..."
          </p>
          <ul style={{ marginLeft: "1.2em", marginBottom: "1.2em" }}>
            {placeholderStudents.map((s, i) =>
              <li key={i}><b>{s.name}</b>: Sorted into <b>{s.house}</b></li>
            )}
            <li>
              <b>{name}</b>: <span style={{ color: "#888" }}>[...]</span>
            </li>
          </ul>
          <p>
            When your name is called, you walk forward, sit gingerly on the stool and the hat slips over your eyes.
            <br />
            <em>
              "Ah, I see a huge amount of <b>{attrLabel}</b> in here... I know what to do with you... better be <b>{sortedHouse}</b>!"
            </em>
          </p>
          <p>
            A round of applause, louder than all the rest, echoes from the table of <b>{sortedHouse}</b> as you make your way over and take your seat. Your wizarding journey begins now...
          </p>
        </div>
        <button
          onClick={() => setStep(4)}
          style={{
            marginTop: "2rem",
            width: "100%",
            padding: "0.75rem",
            fontSize: "1.1rem",
            background: "#4287f5",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Continue to Attributes
        </button>
      </div>
    );
  }

  // Step 4: Distribute Attribute Points (+1 bonus already applied)
  if (step === 4 && house) {
    function handleAttributeChange(attr: keyof typeof attributes, delta: number) {
      const min = DEFAULT_ATTRIBUTE + ((attributeByHouse[house] === attr) ? BONUS : 0);
      if (delta > 0 && pointsLeft > 0) {
        setAttributes(prev => ({ ...prev, [attr]: prev[attr] + 1 }));
        setPointsLeft(pointsLeft - 1);
      }
      if (delta < 0 && attributes[attr] > min) {
        setAttributes(prev => ({ ...prev, [attr]: prev[attr] - 1 }));
        setPointsLeft(pointsLeft + 1);
      }
    }

    async function handleCreateCharacter() {
      setLoading(true);
      setError(null);
      try {
        // Insert character (no spells/items arrays)
        const { data: charData, error: dbError } = await supabase
          .from("characters")
          .insert([{
            user_id: userId,
            name,
            house,
            magic: attributes.magic,
            knowledge: attributes.knowledge,
            courage: attributes.courage,
            agility: attributes.agility,
            charisma: attributes.charisma,
            experience: 0,
            level: 1,
            hit_points: 10,
            scene_id: "wakeup",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }])
          .select("*")
          .single();

        if (dbError) throw dbError;
        if (!charData) {
          setError("Failed to create character: No data returned from Supabase.");
          setLoading(false);
          return;
        }

        // Optionally give starting spells using the character_spells table
        if (DEFAULT_STARTING_SPELLS.length > 0) {
          const spellInserts = DEFAULT_STARTING_SPELLS.map(spell_id => ({
            character_id: charData.id,
            spell_id,
            equipped: false,
          }));
          const { error: spellsError } = await supabase.from("character_spells").insert(spellInserts);
          if (spellsError) throw spellsError;
        }

        onCreate(charData as Character);
        onSelectCharacter(charData.id);
      } catch (err: any) {
        setError("Failed to create character: " + (err.message || err));
      }
      setLoading(false);
    }

    return (
      <div style={{
        background: "#f7f7f7",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        minWidth: "330px",
        margin: "2rem auto"
      }}>
        <h2 style={{ textAlign: "center" }}>Distribute Your Attributes</h2>
        <div style={{ marginBottom: "0.5rem", color: "#666", fontSize: "0.98em" }}>
          <b>House:</b> {house} &mdash; <span>+1 to <b>{attributeByHouse[house]}</b></span>
        </div>
        <div style={{ margin: "1rem 0", textAlign: "center" }}>
          <div style={{ marginBottom: "0.5rem" }}>
            <p>Distribute {pointsLeft} point{pointsLeft !== 1 ? "s" : ""}</p>
          </div>
          {(["magic", "knowledge", "courage", "agility", "charisma"] as const).map(attr => (
            <div key={attr} style={{ margin: "0.5rem 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ width: "110px", textTransform: "capitalize" }}>
                {attr}: <b>{attributes[attr]}</b>
              </span>
              <button
                onClick={() => handleAttributeChange(attr, 1)}
                disabled={pointsLeft === 0}
                style={{
                  margin: "0 0.5rem", padding: "0.25rem 0.75rem", fontWeight: "bold",
                  borderRadius: "4px", border: "1px solid #ccc", background: pointsLeft === 0 ? "#eee" : "#dff0d8", cursor: pointsLeft === 0 ? "not-allowed" : "pointer"
                }}
              >+</button>
              <button
                onClick={() => handleAttributeChange(attr, -1)}
                disabled={attributes[attr] === DEFAULT_ATTRIBUTE + ((attributeByHouse[house] === attr) ? BONUS : 0)}
                style={{
                  margin: "0 0.5rem", padding: "0.25rem 0.75rem", fontWeight: "bold",
                  borderRadius: "4px", border: "1px solid #ccc",
                  background: attributes[attr] === DEFAULT_ATTRIBUTE + ((attributeByHouse[house] === attr) ? BONUS : 0) ? "#eee" : "#f2dede",
                  cursor: attributes[attr] === DEFAULT_ATTRIBUTE + ((attributeByHouse[house] === attr) ? BONUS : 0) ? "not-allowed" : "pointer"
                }}
              >-</button>
            </div>
          ))}
        </div>
        <button
          onClick={handleCreateCharacter}
          disabled={pointsLeft !== 0 || loading}
          style={{
            width: "100%", padding: "0.75rem", fontSize: "1.1rem", marginTop: "1rem",
            background: pointsLeft === 0 && !loading ? "#4287f5" : "#eee",
            color: pointsLeft === 0 && !loading ? "#fff" : "#999",
            border: "none", borderRadius: "8px", fontWeight: "bold",
            cursor: pointsLeft === 0 && !loading ? "pointer" : "not-allowed"
          }}
        >
          {loading ? "Creating..." : "Create Character"}
        </button>
        {error && <div style={{ color: "#b91c1c", marginTop: 10 }}>{error}</div>}
      </div>
    );
  }

  return null;
};

// Helper for tappable word in the hat poem
const TappableWord: React.FC<{ word: "success" | "courage" | "intelligence" | "power"; onSelect: (w: any) => void }> = ({ word, onSelect }) => (
  <span
    onClick={() => onSelect(word)}
    style={{
      cursor: "pointer",
      fontWeight: "bold",
      color: "#b06f21",
      textDecoration: "underline",
      margin: "0 2px",
      transition: "color 0.15s"
    }}
    tabIndex={0}
    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onSelect(word); }}
    role="button"
    aria-label={`Choose ${word}`}
  >
    {word}
  </span>
);

export default CharacterCreation;

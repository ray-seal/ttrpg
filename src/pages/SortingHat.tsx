import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import ThemedLayout from "../components/ThemedLayout";
import { houseThemes, House } from "../themes";

type Attributes = {
  magic: number;
  knowledge: number;
  courage: number;
  agility: number;
  charisma: number;
};

const BASE_ATTRIBUTES: Attributes = {
  magic: 5,
  knowledge: 5,
  courage: 5,
  agility: 5,
  charisma: 5,
};

const houseBonus: Record<House, Partial<Attributes>> = {
  Gryffindor: { courage: 6 },
  Ravenclaw: { knowledge: 6 },
  Hufflepuff: { charisma: 6 },
  Slytherin: { agility: 6 },
};

type HouseType = keyof typeof houseBonus;

type Question = {
  text: string;
  options: { label: string; house: HouseType }[];
};

const questions: Question[] = [
  {
    text: "You enter a magical garden. What do you look at first?",
    options: [
      { label: "A silver leafed tree with golden apples", house: "Slytherin" },
      { label: "The fat red toadstools that appear to be talking to each other", house: "Hufflepuff" },
      { label: "A bubbling pool, in the depths of which something luminous is swirling", house: "Ravenclaw" },
      { label: "A statue of an old wizard with a strangely twinkling eye", house: "Gryffindor" }
    ]
  },
  {
    text: "Which of the following would you most hate people to call you?",
    options: [
      { label: "Cowardly", house: "Gryffindor" },
      { label: "Ordinary", house: "Slytherin" },
      { label: "Ignorant", house: "Ravenclaw" },
      { label: "Selfish", house: "Hufflepuff" }
    ]
  },
  {
    text: "Which kind of instrument most pleases your ear?",
    options: [
      { label: "The violin", house: "Slytherin" },
      { label: "The trumpet", house: "Gryffindor" },
      { label: "The piano", house: "Ravenclaw" },
      { label: "The drum", house: "Hufflepuff" }
    ]
  },
  {
    text: "Which would you rather be?",
    options: [
      { label: "Trusted", house: "Hufflepuff" },
      { label: "Liked", house: "Gryffindor" },
      { label: "Feared", house: "Slytherin" },
      { label: "Envied", house: "Ravenclaw" }
    ]
  },
  {
    text: "A troll has gone berserk in the Headmaster’s study at Hogwarts. In which order would you rescue these objects from the troll’s club, if you could?",
    options: [
      { label: "Student records, then a nearly perfected cure for dragon pox, finally a mysterious handwritten book", house: "Hufflepuff" },
      { label: "A nearly perfected cure for dragon pox, then student records, finally a mysterious handwritten book", house: "Ravenclaw" },
      { label: "A mysterious handwritten book, then a nearly perfected cure for dragon pox, finally student records", house: "Slytherin" },
      { label: "A mysterious handwritten book, then student records, finally a nearly perfected cure for dragon pox", house: "Gryffindor" }
    ]
  }
];

const houseDescriptions: Record<HouseType, string> = {
  Gryffindor: "Brave at heart, daring, chivalrous, and full of nerve.",
  Ravenclaw: "Wit beyond measure, intelligent, creative, and wise.",
  Hufflepuff: "Just and loyal, patient, honest, and unafraid of toil.",
  Slytherin: "Cunning and ambitious, resourceful, and determined."
};

const SortingHat: React.FC<{
  character: any,
  onSorted?: (house: string) => void
}> = ({ character, onSorted }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finalHouse, setFinalHouse] = useState<HouseType | null>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  async function applySorting(house: HouseType) {
    setSaving(true);
    // Apply all base (5) and the house bonus
    const attributes: Attributes = { ...BASE_ATTRIBUTES, ...(houseBonus[house] as Partial<Attributes>) };
    await supabase.from("characters").update({
      house,
      magic: attributes.magic,
      knowledge: attributes.knowledge,
      courage: attributes.courage,
      agility: attributes.agility,
      charisma: attributes.charisma
    }).eq("id", character.id);

    setSaving(false);
    if (onSorted) onSorted(house);
    setTimeout(() => {
      setFinalHouse(house);
    }, 500); // Slight pause to show "Saving..."
  }

  function next(answerIdx: number) {
    setAnswers(ans => [...ans, answerIdx]);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Tally answers
      const houseCount: Record<HouseType, number> = {
        Gryffindor: 0, Ravenclaw: 0, Hufflepuff: 0, Slytherin: 0
      };
      [...answers, answerIdx].forEach((ans, i) => {
        const house = questions[i].options[ans].house;
        houseCount[house] += 1;
      });
      // Find max
      let max = 0;
      let selectedHouse: HouseType = "Gryffindor";
      Object.entries(houseCount).forEach(([house, count]) => {
        if (count > max) {
          max = count;
          selectedHouse = house as HouseType;
        }
      });
      applySorting(selectedHouse);
    }
  }

  if (saving && finalHouse == null) {
    return <div style={{ textAlign: "center", marginTop: "4rem" }}>Saving your house and attributes...</div>;
  }

  if (finalHouse) {
    const attributes = { ...BASE_ATTRIBUTES, ...(houseBonus[finalHouse] as Partial<Attributes>) };
    const theme = houseThemes[finalHouse as House];
    return (
      <ThemedLayout character={{...character, house: finalHouse}}>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <h2>The Sorting Hat has decided...</h2>
          <div style={{
            fontSize: "2.2rem",
            margin: "2rem 0",
            fontWeight: "bold",
            color: theme.accent
          }}>
            {finalHouse}
          </div>
          <div style={{ fontStyle: "italic", marginBottom: "2rem" }}>
            {houseDescriptions[finalHouse]}
          </div>
          <div>
            <strong>Your Attributes:</strong>
            <ul style={{ display: "inline-block", textAlign: "left", margin: "1rem auto" }}>
              <li><b>Magic:</b> {attributes.magic}</li>
              <li><b>Knowledge:</b> {attributes.knowledge}</li>
              <li><b>Courage:</b> {attributes.courage}</li>
              <li><b>Agility:</b> {attributes.agility}</li>
              <li><b>Charisma:</b> {attributes.charisma}</li>
            </ul>
          </div>
          <div style={{ margin: "2.5rem 0", fontSize: "1.1rem" }}>
            <b>Your friend from the train has also been sorted into {finalHouse}!</b>
          </div>
          <div style={{ margin: "2.5rem 0", fontSize: "1.1rem" }}>
            <b>
              The newly appointed Head of {finalHouse} greets you warmly, presents you with a {finalHouse} scarf, and hands you your first-year timetable.
            </b>
          </div>
          <div>
            <h4>Your Timetable:</h4>
            <ul style={{ display: "inline-block", textAlign: "left", margin: "1rem auto" }}>
              <li><b>Monday:</b> Charms: Wingardium Leviosa</li>
              <li><b>Tuesday:</b> Charms: Alohomora</li>
              <li><b>Wednesday:</b> Charms: Lumos</li>
              <li><b>Thursday:</b> Potions (coming soon)</li>
              <li><b>Friday:</b> Transfiguration (coming soon)</li>
            </ul>
          </div>
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <button
              onClick={() => navigate("/character-sheet")}
              style={{
                background: theme.accent,
                color: theme.primary,
                padding: "0.8rem 2rem",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "1rem",
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              Continue to your Character Sheet
            </button>
          </div>
        </div>
      </ThemedLayout>
    );
  }

  const q = questions[step];
  return (
    <ThemedLayout character={character}>
      <h2 style={{ fontFamily: "cursive", textAlign: "center", marginBottom: "1.8rem" }}>
        The Sorting Hat Ceremony
      </h2>
      <div style={{ fontWeight: "bold", marginBottom: "1.5rem" }}>
        {q.text}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => next(idx)}
            style={{
              background: "#b79b5a",
              color: "#fff",
              padding: "1rem 2.2rem",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              border: "none",
              cursor: "pointer"
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div style={{ marginTop: "2rem", textAlign: "center", color: "#87724a" }}>
        Question {step + 1} of {questions.length}
      </div>
    </ThemedLayout>
  );
};

export default SortingHat;

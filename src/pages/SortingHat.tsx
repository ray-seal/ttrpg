import React, { useState } from "react";

type Question = {
  text: string;
  options: { label: string; house: "Gryffindor" | "Ravenclaw" | "Hufflepuff" | "Slytherin" }[];
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

const houseDescriptions: Record<string, string> = {
  Gryffindor: "Brave at heart, daring, chivalrous, and full of nerve.",
  Ravenclaw: "Wit beyond measure, intelligent, creative, and wise.",
  Hufflepuff: "Just and loyal, patient, honest, and unafraid of toil.",
  Slytherin: "Cunning and ambitious, resourceful, and determined."
};

const SortingHat: React.FC<{ onSort: (house: string) => void }> = ({ onSort }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finalHouse, setFinalHouse] = useState<string | null>(null);

  function next(answerIdx: number) {
    setAnswers(ans => [...ans, answerIdx]);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Tally answers
      const houseCount: Record<string, number> = {
        Gryffindor: 0, Ravenclaw: 0, Hufflepuff: 0, Slytherin: 0
      };
      [...answers, answerIdx].forEach((ans, i) => {
        const house = questions[i].options[ans].house;
        houseCount[house] += 1;
      });
      // Find max
      let max = 0;
      let selectedHouse = "Gryffindor";
      Object.entries(houseCount).forEach(([house, count]) => {
        if (count > max) {
          max = count;
          selectedHouse = house;
        }
      });
      setFinalHouse(selectedHouse);
      setTimeout(() => {
        onSort(selectedHouse);
      }, 1750); // dramatic pause before advancing
    }
  }

  if (finalHouse) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <h2>The Sorting Hat has decided...</h2>
        <div style={{
          fontSize: "2.2rem",
          margin: "2rem 0",
          fontWeight: "bold",
          color: "#b79b5a"
        }}>
          {finalHouse}
        </div>
        <div style={{ fontStyle: "italic", marginBottom: "2rem" }}>
          {houseDescriptions[finalHouse]}
        </div>
        <div>Good luck at Hogwarts!</div>
      </div>
    );
  }

  const q = questions[step];
  return (
    <div style={{
      maxWidth: 600, margin: "2rem auto", padding: "2.5rem",
      background: "#f5efd9", borderRadius: 14, fontFamily: "serif", color: "#432c15", border: "2px solid #b79b5a"
    }}>
      <h2 style={{ fontFamily: "cursive", textAlign: "center", marginBottom: "1.8rem", color: "#1e1c17" }}>
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
    </div>
  );
};

export default SortingHat;

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quests from "../quests/ravenclaw.json";
import ThemedLayout from "../components/ThemedLayout";
import DiceButton from "../components/DiceButton";

/**
 * QuestRunner handles Ravenclaw side quests.
 * completedLessons is used as the learned spell list.
 */
function getQuestById(id) {
  return quests.find(q => q.id === id);
}

export default function QuestRunner({ character, house }) {
  const { questId } = useParams();
  const navigate = useNavigate();
  const quest = getQuestById(questId);
  const [stepIdx, setStepIdx] = useState(0);
  const [equippedSpells, setEquippedSpells] = useState([]);
  const [showDice, setShowDice] = useState(false);
  const [diceProps, setDiceProps] = useState({});

  if (!quest) return <div>Quest not found.</div>;
  const step = quest.steps[stepIdx];

  // Handle quest actions (next step or exit)
  function handleAction(action) {
    if (action.next) {
      const idx = quest.steps.findIndex(s => s.id === action.next);
      setStepIdx(idx);
    } else if (
      action.result === "fail" ||
      action.result === "success" ||
      action.result === "declined"
    ) {
      navigate("/commonrooms/ravenclaw/noticeboard");
    }
  }

  // Dice check step
  function handleDiceCheck(attr, dice, difficulty, successId, failId) {
    setDiceProps({
      allowedDice: [dice],
      showModal: true,
      onRoll: (result, sides) => {
        setShowDice(false);
        const total = result + (character[attr] || 0);
        const nextId = total >= difficulty ? successId : failId;
        const idx = quest.steps.findIndex(s => s.id === nextId);
        setStepIdx(idx);
      },
      onClose: () => setShowDice(false),
    });
    setShowDice(true);
  }

  // Equip spells step: use completedLessons as learned spells
  function handleSpellEquip(maxSpells, nextId) {
    const learnedSpells = character.completedLessons || [];
    if (learnedSpells.length === 0) {
      alert("You haven't learned any spells yet! Attend some classes first.");
      return;
    }
    // For now, auto-equip up to maxSpells (could implement modal selection)
    setEquippedSpells(learnedSpells.slice(0, maxSpells));
    const idx = quest.steps.findIndex(s => s.id === nextId);
    setStepIdx(idx);
  }

  // Spell check step
  function handleSpellCheck(requiredSpell, attr, dice, difficulty, successId, failId) {
    if (!equippedSpells.includes(requiredSpell)) {
      const idx = quest.steps.findIndex(s => s.id === failId);
      setStepIdx(idx);
      return;
    }
    setDiceProps({
      allowedDice: [dice],
      showModal: true,
      onRoll: (result, sides) => {
        setShowDice(false);
        const total = result + (character[attr] || 0);
        const nextId = total >= difficulty ? successId : failId;
        const idx = quest.steps.findIndex(s => s.id === nextId);
        setStepIdx(idx);
      },
      onClose: () => setShowDice(false),
    });
    setShowDice(true);
  }

  // Render quest step
  return (
    <ThemedLayout character={character}>
      <h2>{quest.title}</h2>
      <div style={{ minHeight: 120 }}>
        <p>{step.text}</p>
        {/* Action buttons */}
        {step.actions && step.actions.map((a, i) => (
          <button key={i} style={{ margin: 8 }} onClick={() => handleAction(a)}>
            {a.label}
          </button>
        ))}
        {/* Choices */}
        {step.choices && step.choices.map((c, i) => (
          <button key={i} style={{ margin: 8 }} onClick={() => {
            const idx = quest.steps.findIndex(s => s.id === c.next);
            setStepIdx(idx);
          }}>
            {c.label}
          </button>
        ))}
        {/* Equip spells */}
        {step.type === "equip-spells" && (
          <button
            onClick={() => handleSpellEquip(step.maxSpells, step.actions[0].next)}
            style={{ margin: 8 }}
          >
            Equip Spells
          </button>
        )}
        {/* Dice check */}
        {step.type === "dice-check" && (
          <button
            onClick={() =>
              handleDiceCheck(
                step.attribute,
                step.dice,
                step.difficulty,
                step.success,
                step.fail
              )
            }
            style={{ margin: 8 }}
          >
            Roll for {step.attribute.charAt(0).toUpperCase() + step.attribute.slice(1)}
          </button>
        )}
        {/* Spell check */}
        {step.type === "spell-check" && (
          <button
            onClick={() =>
              handleSpellCheck(
                step.requiredSpell,
                step.attribute,
                step.dice,
                step.difficulty,
                step.success,
                step.fail
              )
            }
            style={{ margin: 8 }}
          >
            Use {step.requiredSpell}
          </button>
        )}
      </div>
      {/* Dice Modal */}
      {showDice && <DiceButton {...diceProps} />}
      <button style={{ marginTop: 20 }} onClick={() => navigate(-1)}>
        Back
      </button>
    </ThemedLayout>
  );
}

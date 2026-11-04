import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemedLayout from "../components/ThemedLayout";
import DiceButton from "../components/DiceButton";
import { Character } from "../types";
import { houseThemes, House } from "../themes";
import { supabase } from "../supabaseClient";
import scenesData from "../campaigns/year1-main.json";

type RollRule = { stat: "magic" | "knowledge" | "courage" | "agility" | "charisma"; target: number; success: string; fail: string };
type Choice = { text: string; next?: string; action?: string; setFlag?: string; requiredFlag?: string; requiredSpell?: string; requiredItem?: string; awardExperience?: number; awardItem?: string; roll?: RollRule };
type Scene = { id: string; text: string; chapter?: string; choices: Choice[] };
const scenes = (scenesData as { scenes: Scene[] }).scenes;

export default function CampaignPage({ character, setCharacter }: { character: Character; setCharacter: (c: Character) => void }) {
  const navigate = useNavigate();
  const theme = houseThemes[character.house as House] || houseThemes.Gryffindor;
  const [sceneId, setSceneId] = useState(character.currentSceneId || "wakeup");
  const [rolling, setRolling] = useState<RollRule | null>(null);
  const [showDice, setShowDice] = useState(false);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const scene = useMemo(() => scenes.find(item => item.id === sceneId) || scenes[0], [sceneId]);
  const flags = character.flags || {};
  const choices = scene.choices.filter(choice =>
    (!choice.requiredFlag || !!flags[choice.requiredFlag]) &&
    (!choice.requiredSpell || character.unlockedSpells?.includes(choice.requiredSpell)) &&
    (!choice.requiredItem || character.items?.includes(choice.requiredItem))
  );

  async function moveTo(nextId: string, choice?: Choice) {
    const nextFlags = { ...flags };
    if (choice?.setFlag) nextFlags[choice.setFlag] = true;
    const nextItems = choice?.awardItem ? Array.from(new Set([...(character.items || []), choice.awardItem])) : character.items || [];
    const nextExperience = (character.experience || 0) + (choice?.awardExperience || 0);
    const nextCharacter = { ...character, flags: nextFlags, items: nextItems, experience: nextExperience, currentSceneId: nextId };
    setSaving(true);
    setSaveError("");
    if ((character as any).id) {
      const { error } = await supabase.from("characters").update({
        flags: nextFlags, items: nextItems, experience: nextExperience, currentSceneId: nextId
      }).eq("id", (character as any).id);
      if (error) setSaveError("Your choice is shown, but the save could not be confirmed. Please check your connection before leaving this page.");
    }
    setCharacter(nextCharacter);
    setSceneId(nextId);
    setSaving(false);
  }

  async function handleChoice(choice: Choice) {
    if (choice.action === "gotoSchool") {
      setSaving(true);
      if ((character as any).id) {
        const { error } = await supabase.from("characters").update({ currentSceneId: null, flags }).eq("id", (character as any).id);
        if (error) setSaveError("You can return to school, but the campaign checkpoint may not have saved.");
      }
      setCharacter({ ...character, currentSceneId: undefined });
      setSaving(false);
      navigate("/school");
      return;
    }
    if (choice.roll) {
      setRolling(choice.roll);
      setShowDice(true);
      return;
    }
    if (choice.next) await moveTo(choice.next, choice);
  }

  async function handleRoll(result: number) {
    if (!rolling) return;
    const total = result + (Number((character as any)[rolling.stat]) || 0);
    const destination = total >= rolling.target ? rolling.success : rolling.fail;
    setRollResult(total);
    setShowDice(false);
    setRolling(null);
    await moveTo(destination);
  }

  const completed = scene.id === "chapter_end";
  const progress = Math.max(4, Math.round((scenes.findIndex(item => item.id === scene.id) + 1) / scenes.length * 100));
  return (
    <ThemedLayout character={character}>
      <div style={{ maxWidth: 760, margin: "0 auto", paddingBottom: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
          <div style={{ fontSize: "2rem" }}>🏰</div>
          <h2 style={{ fontFamily: "Georgia, serif", color: theme.accent, margin: "0.25rem 0" }}>The Hogwarts Adventure</h2>
          <p style={{ color: theme.primary, margin: 0 }}>Your first-year story · {character.house}</p>
        </div>
        <div style={{ background: "#fffdf5", border: "2px solid " + theme.accent, borderRadius: 18, padding: "clamp(1.1rem, 4vw, 2rem)", boxShadow: "0 8px 28px rgba(0,0,0,.09)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", color: theme.secondary, fontSize: ".88rem", fontWeight: 700 }}>
            <span>{scene.chapter || "Your Hogwarts Story"}</span><span>{character.experience || 0} XP</span>
          </div>
          <div style={{ height: 3, background: "#e8dfc9", borderRadius: 4, margin: "1rem 0 1.4rem" }}>
            <div style={{ width: progress + "%", height: "100%", background: theme.accent, borderRadius: 4 }} />
          </div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "1.12rem", lineHeight: 1.85, color: "#352b20", whiteSpace: "pre-line", margin: 0 }}>{scene.text}</p>
          {rollResult !== null && <div style={{ marginTop: 16, padding: 12, background: "#edf5ed", borderRadius: 10, color: "#245b35", fontWeight: 700 }}>Your total: {rollResult} (including your attribute bonus)</div>}
          {saveError && <p role="alert" style={{ color: "#a12b2b", background: "#fff0ed", borderRadius: 8, padding: 10 }}>{saveError}</p>}
          <div style={{ display: "grid", gap: 10, marginTop: 24 }}>
            {choices.map((choice, index) => (
              <button key={scene.id + "-" + index} disabled={saving || showDice} onClick={() => handleChoice(choice)} style={{ textAlign: "left", padding: "1rem 1.1rem", borderRadius: 11, border: "1px solid " + theme.accent, background: "#f5efe0", color: "#352b20", fontSize: "1rem", fontWeight: 700, cursor: saving ? "wait" : "pointer" }}>
                {choice.roll ? "🎲 " : "›  "}{choice.text}
              </button>
            ))}
          </div>
          {completed && <p style={{ marginTop: 18, color: theme.secondary, fontWeight: 700 }}>Chapter One complete. Your progress is saved to your character.</p>}
          {saving && <p style={{ textAlign: "center", color: theme.secondary }}>Saving your adventure…</p>}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
          <button onClick={() => navigate("/spellbook")} style={secondaryButton}>📖 Spellbook</button>
          <button onClick={() => navigate("/character-sheet")} style={secondaryButton}>🪄 Character sheet</button>
          <button onClick={() => navigate("/school")} style={secondaryButton}>🏰 School</button>
        </div>
      </div>
      {showDice && <DiceButton allowedDice={[12]} highlightDice={12} showModal={true} onRoll={handleRoll} onClose={() => { setShowDice(false); setRolling(null); }} />}
    </ThemedLayout>
  );
}

const secondaryButton: React.CSSProperties = { border: "1px solid #b79b5a", borderRadius: 9, background: "#fffdf5", color: "#49391f", padding: ".7rem 1rem", fontWeight: 700, cursor: "pointer" };

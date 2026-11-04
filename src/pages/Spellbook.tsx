import React, { useState } from "react";
import { Character } from "../types";
import ThemedLayout from "../components/ThemedLayout";
import { houseThemes, House } from "../themes";
import { supabase } from "../supabaseClient";
const SPELLS = [{name:"Lumos",description:"Creates light at the tip of your wand."},{name:"Alohomora",description:"Unlocks simple, magically secured doors."},{name:"Wingardium Leviosa",description:"Lifts and moves light objects."},{name:"Incendio",description:"A beginner's fire-making charm. Not yet taught."},{name:"Nox",description:"Extinguishes the light created by Lumos. Not yet taught."}];
export default function Spellbook({character,setCharacter}:{character:Character;setCharacter:(c:Character)=>void}) {
 const theme=houseThemes[character.house as House]||houseThemes.Gryffindor, learned=character.unlockedSpells||[], equipped=character.equippedSpells||[];
 const [saving,setSaving]=useState(false),[error,setError]=useState("");
 async function toggleSpell(name:string) {
  if(!learned.includes(name)||saving)return;
  if(!equipped.includes(name)&&equipped.length>=2){setError("You can prepare up to two spells at a time. Unequip one before choosing another.");return;}
  const next=equipped.includes(name)?equipped.filter(s=>s!==name):[...equipped,name];
  setSaving(true);setError("");
  const {error:dbError}=await supabase.from("characters").update({equippedSpells:next}).eq("id",(character as any).id);
  setSaving(false);if(dbError){setError("Could not save your prepared spells: "+dbError.message);return;}
  setCharacter({...character,equippedSpells:next});
 }
 return <ThemedLayout character={character}><div style={{maxWidth:680,margin:"0 auto"}}>
  <h2 style={{textAlign:"center",color:theme.accent,fontFamily:"Georgia,serif"}}>📖 Standard Book of Spells · Grade 1</h2>
  <p style={{textAlign:"center",color:theme.primary}}>Spells you have learned during your time at Hogwarts.</p>
  <div style={{display:"grid",gap:12}}>{SPELLS.map(spell=>{const isLearned=learned.includes(spell.name),isEquipped=equipped.includes(spell.name);return <div key={spell.name} style={{background:"#fffdf5",border:"1px solid "+(isEquipped?theme.accent:"#d8cfbd"),borderRadius:12,padding:"1rem",opacity:isLearned?1:.65}}>
   <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}><strong style={{color:theme.primary}}>{isLearned?"✨ ":"🔒 "}{spell.name}</strong>
   {isLearned?<button disabled={saving} onClick={()=>toggleSpell(spell.name)} style={{border:0,borderRadius:8,padding:".55rem .9rem",background:isEquipped?theme.accent:"#e8e0d1",color:isEquipped?"#fff":"#3b3025",fontWeight:700}}>{isEquipped?"Prepared ✓":"Prepare"}</button>:<span style={{fontSize:".85rem",color:"#776b5b"}}>Not learned</span>}</div>
   <p style={{margin:".55rem 0 0",color:"#514638"}}>{spell.description}</p></div>})}</div>
  <p style={{textAlign:"center",marginTop:16,color:theme.secondary}}>Prepared: {equipped.length}/2</p>{error&&<p role="alert" style={{color:"#a12b2b",textAlign:"center"}}>{error}</p>}{saving&&<p style={{textAlign:"center"}}>Saving spellbook…</p>}
 </div></ThemedLayout>;
}
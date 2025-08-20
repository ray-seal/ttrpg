import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Character } from "../types";

const WAND_ITEM_ID = "9c1c1a36-8f3f-4c0e-b9b1-222222222222";
const ROBES_ITEM_ID = "37e9c6fb-3f81-4d7d-9c3c-444444444444";

const SchoolGate: React.FC<{ character: Character; children: React.ReactNode }> = ({ character, children }) => {
  const [loading, setLoading] = useState(true);
  const [hasWand, setHasWand] = useState(false);
  const [hasRobes, setHasRobes] = useState(false);

  useEffect(() => {
    async function checkItems() {
      setLoading(true);
      const { data: wand } = await supabase
        .from("character_items")
        .select("id")
        .eq("character_id", character.id)
        .eq("item_id", WAND_ITEM_ID)
        .maybeSingle();
      const { data: robes } = await supabase
        .from("character_items")
        .select("id")
        .eq("character_id", character.id)
        .eq("item_id", ROBES_ITEM_ID)
        .maybeSingle();
      setHasWand(!!wand);
      setHasRobes(!!robes);
      setLoading(false);
    }
    checkItems();
  }, [character.id]);

  if (loading) {
    return <div style={{textAlign:"center",marginTop:"4rem"}}>Checking your supplies...</div>;
  }

  if (hasWand && hasRobes) {
    return <>{children}</>;
  }

  // Not ready for school!
  return <Navigate to="/hogwarts-letter" replace />;
};

export default SchoolGate;

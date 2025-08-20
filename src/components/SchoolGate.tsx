import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Character } from "../types";

// Make sure these IDs match what's in your database!
const WAND_ITEM_ID = "9c1c1a36-8f3f-4c0e-b9b1-222222222222";
const ROBES_ITEM_ID = "37e9c6fb-3f81-4d7d-9c3c-444444444444";

const SchoolGate: React.FC<{ character: Character; children: React.ReactNode }> = ({ character, children }) => {
  const [loading, setLoading] = useState(true);
  const [hasWand, setHasWand] = useState<boolean | null>(null);
  const [hasRobes, setHasRobes] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function checkItems() {
      setLoading(true);
      // Check for wand
      const { data: wandRows, error: wandError } = await supabase
        .from("character_items")
        .select("id")
        .eq("character_id", character.id)
        .eq("item_id", WAND_ITEM_ID);

      // Check for robes
      const { data: robesRows, error: robesError } = await supabase
        .from("character_items")
        .select("id")
        .eq("character_id", character.id)
        .eq("item_id", ROBES_ITEM_ID);

      if (!cancelled) {
        setHasWand(Array.isArray(wandRows) && wandRows.length > 0);
        setHasRobes(Array.isArray(robesRows) && robesRows.length > 0);
        setLoading(false);
      }
    }
    checkItems();
    return () => { cancelled = true; };
  }, [character.id]);

  if (loading || hasWand === null || hasRobes === null) {
    return <div style={{textAlign:"center",marginTop:"4rem"}}>Checking your supplies...</div>;
  }

  if (hasWand && hasRobes) {
    return <>{children}</>;
  }

  // Not ready for school!
  return <Navigate to="/hogwarts-letter" replace />;
};

export default SchoolGate;

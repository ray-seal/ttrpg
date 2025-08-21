import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const WAND_ITEM_ID = "9c1c1a36-8f3f-4c0e-b9b1-222222222222";
const ROBES_ITEM_ID = "37e9c6fb-3f81-4d7d-9c3c-444444444444";

const RequireWandAndRobes: React.FC<{ characterId: string, children: React.ReactNode }> = ({ characterId, children }) => {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("character_items")
      .select("item_id")
      .eq("character_id", characterId)
      .then(({ data }) => {
        const hasWand = data?.some(item => item.item_id === WAND_ITEM_ID);
        const hasRobes = data?.some(item => item.item_id === ROBES_ITEM_ID);
        setOk(!!(hasWand && hasRobes));
        setLoading(false);
        if (!(hasWand && hasRobes)) navigate("/diagon-alley");
      });
  }, [characterId, navigate]);

  if (loading) return <div>Checking your inventory...</div>;
  return ok ? <>{children}</> : null;
};

export default RequireWandAndRobes;

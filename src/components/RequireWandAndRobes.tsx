import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const WAND_ITEM_ID = "9c1c1a36-8f3f-4c0e-b9b1-222222222222";
const ROBES_ITEM_ID = "37e9c6fb-3f81-4d7d-9c3c-444444444444";

const RequireWandAndRobes: React.FC<{ characterId: string, children: React.ReactNode }> = ({
  characterId,
  children,
}) => {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    supabase
      .from("character_items")
      .select("item_id")
      .eq("character_id", characterId)
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error) {
          setError("Error loading inventory: " + error.message);
          setLoading(false);
          return;
        }
        if (!data) {
          setError("No inventory data found.");
          setLoading(false);
          return;
        }
        const hasWand = data.some((item) => item.item_id === WAND_ITEM_ID);
        const hasRobes = data.some((item) => item.item_id === ROBES_ITEM_ID);
        setOk(hasWand && hasRobes);
        setLoading(false);
        if (!(hasWand && hasRobes)) {
          setTimeout(() => navigate("/diagon-alley"), 1200);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [characterId, navigate]);

  if (loading) return <div style={{ padding: 32, textAlign: "center" }}>Checking your inventory...</div>;
  if (error) return (
    <div style={{ color: "crimson", padding: 32, textAlign: "center" }}>
      {error}
      <br />
      <button onClick={() => window.location.reload()} style={{marginTop:16}}>Retry</button>
    </div>
  );
  if (!ok) {
    return (
      <div style={{ padding: 32, textAlign: "center" }}>
        You need both a wand and school robes before you can board the train.
        <br />
        Redirecting you to Diagon Alley...
      </div>
    );
  }
  return <>{children}</>;
};

export default RequireWandAndRobes;

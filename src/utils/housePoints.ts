import { supabase } from "../supabaseClient";

/**
 * Apply a quest's house-point result through the database's atomic,
 * idempotent function. The server verifies the signed-in user, character,
 * house, allowed quest and one-time completion before changing the shared score.
 */
export async function updateHousePoints(
  house: string,
  delta: number,
  characterId: string,
  questId: string
): Promise<boolean> {
  if (!characterId || !questId) return false;

  const reason = delta > 0
    ? `Quest completed: ${questId}`
    : `Quest failed: ${questId}`;

  const { data, error } = await supabase.rpc("apply_house_points", {
    p_house: house,
    p_delta: delta,
    p_reason: reason,
    p_character_id: characterId,
    p_quest_id: questId,
  });

  return !error && typeof data === "number";
}

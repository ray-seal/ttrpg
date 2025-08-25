import { supabase } from "../supabaseClient";

/**
 * Updates house points by a delta (can be positive or negative).
 * @param {string} house - House name, e.g. "Ravenclaw"
 * @param {number} delta - Number of points to add or remove
 * @returns {Promise<boolean>} true if successful, false if error
 */
export async function updateHousePoints(house, delta) {
  // Fetch current points
  const { data, error } = await supabase
    .from("house_points")
    .select("points")
    .eq("house", house)
    .single();
  if (error || !data) return false;
  const newPoints = (data.points || 0) + delta;
  // Update
  const { error: updateError } = await supabase
    .from("house_points")
    .update({ points: newPoints, updated_at: new Date().toISOString() })
    .eq("house", house);
  return !updateError;
}

/**
 * Safely extract and clean JSON from AI response text.
 * - Removes markdown fences (```json ... ```)
 * - Removes leading/trailing text
 * - Returns parsed JSON if valid
 * - If no JSON found, returns null
 */

export function cleanAIJsonResponse<T = any>(text: string): T | null {
  if (!text) return null;

  try {
    // --- Case 1: Already valid JSON ---
    // Try parsing directly first
    return JSON.parse(text);
  } catch {
    // --- Case 2: Clean markdown / extra text ---
    try {
      // Match any JSON-like block (object or array)
      const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (!match) return null;

      const cleanText = match[0]
        // remove control characters
        .replace(/[\u0000-\u001F]+/g, '')
        // trim extra spaces
        .trim();

      return JSON.parse(cleanText);
    } catch (err) {
      console.error('❌ Failed to parse AI JSON response:', err);
      return null;
    }
  }
}

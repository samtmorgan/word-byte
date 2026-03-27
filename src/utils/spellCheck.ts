export async function checkSpelling(word: string): Promise<{ valid: boolean }> {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (response.ok) {
      return { valid: true };
    }
    if (response.status === 404) {
      return { valid: false };
    }
    // Fallback: allow submission if API is unavailable
    return { valid: true };
  } catch {
    // Graceful fallback if API is unavailable
    return { valid: true };
  }
}

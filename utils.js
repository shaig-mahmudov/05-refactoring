export function cleanText(text) {
  return text.trim().replace(/\s+/g, ' ');
}

export function splitIntoWords(text) {
  return text.split(' ');
}

export function removeEmptyWords(words) {
  return words.filter(function(word) {
    return word !== '';
  });
}

export function estimateTokens(words) {
  return Math.ceil(words.length * 0.75);
}

export function countTokens(text) {
  const cleaned = cleanText(text);
  const words = splitIntoWords(cleaned);
  const filtered = removeEmptyWords(words);

  return estimateTokens(filtered);
}

export function analyzeText(text) {
  const cleaned = cleanText(text);
  const words = splitIntoWords(cleaned);
  const filtered = removeEmptyWords(words);

  return {
    characters: cleaned.length,
    words: filtered.length,
    tokens: estimateTokens(filtered)
  };
}

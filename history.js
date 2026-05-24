import { analyzeText } from './utils.js';

const history = [];

export function addSnapshot(text) {
  const analysis = analyzeText(text);
  const snapshot = {
    label: 'Snapshot ' + (history.length + 1),
    timestamp: new Date().toLocaleTimeString(),
    characters: analysis.characters,
    words: analysis.words,
    tokens: analysis.tokens
  };

  history.push(snapshot);
  return snapshot;
}

export function getHistory() {
  return history.slice();
}

export function clearHistory() {
  history.length = 0;
}

export function getHighestTokenCount() {
  if (history.length === 0) {
    return 0;
  }

  const tokenCounts = history.map(function(entry) {
    return entry.tokens;
  });

  return Math.max.apply(null, tokenCounts);
}

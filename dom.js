import { analyzeText } from './utils.js';
import {
  addSnapshot,
  clearHistory,
  getHighestTokenCount,
  getHistory
} from './history.js';

const textarea = document.querySelector('#inputText');
const statChars = document.querySelector('#stat-chars');
const statWords = document.querySelector('#stat-words');
const statTokens = document.querySelector('#stat-tokens');
const saveBtn = document.querySelector('#save-btn');
const clearBtn = document.querySelector('#clear-btn');
const historyList = document.querySelector('#history-list');
const maxTokensEl = document.querySelector('#max-tokens');

function updateStats() {
  const analysis = analyzeText(textarea.value);

  statChars.textContent = 'Characters: ' + analysis.characters;
  statWords.textContent = 'Words: ' + analysis.words;
  statTokens.textContent = 'Estimated tokens: ' + analysis.tokens;
  saveBtn.disabled = textarea.value.trim() === '';
}

function updateHighestTokenCount() {
  maxTokensEl.textContent = 'Highest token count: ' + getHighestTokenCount();
}

function renderHistory() {
  historyList.innerHTML = '';

  getHistory().forEach(function(entry) {
    const li = document.createElement('li');
    li.textContent = entry.label + ' (' + entry.timestamp + '): ' + entry.tokens + ' tokens, ' + entry.words + ' words, ' + entry.characters + ' characters';
    historyList.appendChild(li);
  });

  updateHighestTokenCount();
}

textarea.addEventListener('input', function() {
  updateStats();
});

saveBtn.addEventListener('click', function() {
  if (textarea.value.trim() === '') {
    saveBtn.disabled = true;
    return;
  }

  addSnapshot(textarea.value);
  renderHistory();
});

clearBtn.addEventListener('click', function() {
  clearHistory();
  renderHistory();
});

updateStats();
renderHistory();

const STORAGE_KEY = "namma-jeopardy-state-v1";
const POINT_VALUES = [100, 200, 300, 400, 500];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore corrupt state */ }
  const scores = {};
  TEAMS.forEach(t => scores[t.id] = 0);
  return { used: {}, scores };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();
let currentClue = null; // { catIdx, value }

const boardEl = document.getElementById("board");
const scoreboardEl = document.getElementById("scoreboard");
const clueScreen = document.getElementById("clueScreen");
const clueStage = document.getElementById("clueStage");
const answerStage = document.getElementById("answerStage");
const clueMeta = document.getElementById("clueMeta");
const clueText = document.getElementById("clueText");
const answerText = document.getElementById("answerText");
const answerTag = document.getElementById("answerTag");
const awardRow = document.getElementById("awardRow");

function cellKey(catIdx, value) {
  return `${catIdx}-${value}`;
}

function renderScoreboard() {
  scoreboardEl.innerHTML = "";
  TEAMS.forEach(team => {
    const div = document.createElement("div");
    div.className = "team-score";
    div.innerHTML = `
      <div class="label">${team.label}</div>
      <div class="full">${team.full}</div>
      <div class="points">${state.scores[team.id] || 0}</div>
    `;
    div.addEventListener("click", () => openScoreModal(team));
    scoreboardEl.appendChild(div);
  });
}

function renderBoard() {
  boardEl.innerHTML = "";

  CATEGORIES.forEach(cat => {
    const header = document.createElement("div");
    header.className = "cat-header";
    header.textContent = cat.name;
    boardEl.appendChild(header);
  });

  POINT_VALUES.forEach(value => {
    CATEGORIES.forEach((cat, catIdx) => {
      const cell = document.createElement("div");
      const used = !!state.used[cellKey(catIdx, value)];
      cell.className = "cell" + (used ? " used" : "");
      cell.textContent = used ? "" : `$${value}`;
      if (!used) {
        cell.addEventListener("click", () => openClue(catIdx, value));
      }
      boardEl.appendChild(cell);
    });
  });
}

function openClue(catIdx, value) {
  currentClue = { catIdx, value };
  const cat = CATEGORIES[catIdx];
  const data = cat.clues[value];

  clueMeta.textContent = `${cat.name} — ${value} Points`;

  if (data.emoji) {
    clueText.textContent = data.emoji;
    clueText.classList.add("emoji");
  } else {
    clueText.textContent = data.clue;
    clueText.classList.remove("emoji");
  }

  clueStage.style.display = "";
  answerStage.style.display = "none";
  clueScreen.classList.remove("hidden");
}

function revealAnswer() {
  const { catIdx, value } = currentClue;
  const cat = CATEGORIES[catIdx];
  const data = cat.clues[value];

  // Lock the clue on the board now that the answer is shown.
  state.used[cellKey(catIdx, value)] = true;
  saveState();
  renderBoard();

  answerText.textContent = data.answer;
  answerTag.textContent = data.tag;

  awardRow.innerHTML = "";
  TEAMS.forEach(team => {
    const btn = document.createElement("button");
    btn.className = "award-btn";
    btn.textContent = `${team.label} +${value}`;
    btn.addEventListener("click", () => awardPoints(team.id, value));
    awardRow.appendChild(btn);
  });
  const noneBtn = document.createElement("button");
  noneBtn.className = "award-btn none";
  noneBtn.textContent = "No one got it";
  noneBtn.addEventListener("click", closeClue);
  awardRow.appendChild(noneBtn);

  clueStage.style.display = "none";
  answerStage.style.display = "";
}

function awardPoints(teamId, value) {
  state.scores[teamId] = (state.scores[teamId] || 0) + value;
  saveState();
  renderScoreboard();
  closeClue();
}

function closeClue() {
  clueScreen.classList.add("hidden");
  currentClue = null;
}

document.getElementById("revealBtn").addEventListener("click", revealAnswer);
document.getElementById("backFromClueBtn").addEventListener("click", closeClue);
document.getElementById("backFromAnswerBtn").addEventListener("click", closeClue);

// ---- Reset modal ----
const resetModal = document.getElementById("resetModal");
document.getElementById("resetBtn").addEventListener("click", () => resetModal.classList.remove("hidden"));
document.getElementById("cancelResetBtn").addEventListener("click", () => resetModal.classList.add("hidden"));
document.getElementById("confirmResetBtn").addEventListener("click", () => {
  const scores = {};
  TEAMS.forEach(t => scores[t.id] = 0);
  state = { used: {}, scores };
  saveState();
  renderBoard();
  renderScoreboard();
  resetModal.classList.add("hidden");
});

// ---- Manual score adjust modal ----
const scoreModal = document.getElementById("scoreModal");
const scoreModalLabel = document.getElementById("scoreModalLabel");
const scoreModalValue = document.getElementById("scoreModalValue");
let adjustingTeam = null;

function openScoreModal(team) {
  adjustingTeam = team;
  scoreModalLabel.textContent = `Adjust score for ${team.full} (${team.label})`;
  scoreModalValue.textContent = state.scores[team.id] || 0;
  scoreModal.classList.remove("hidden");
}

document.getElementById("scorePlus").addEventListener("click", () => {
  state.scores[adjustingTeam.id] = (state.scores[adjustingTeam.id] || 0) + 100;
  scoreModalValue.textContent = state.scores[adjustingTeam.id];
  saveState();
  renderScoreboard();
});
document.getElementById("scoreMinus").addEventListener("click", () => {
  state.scores[adjustingTeam.id] = (state.scores[adjustingTeam.id] || 0) - 100;
  scoreModalValue.textContent = state.scores[adjustingTeam.id];
  saveState();
  renderScoreboard();
});
document.getElementById("closeScoreModal").addEventListener("click", () => {
  scoreModal.classList.add("hidden");
  adjustingTeam = null;
});

renderBoard();
renderScoreboard();

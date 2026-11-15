const STORAGE_KEY = "namma-jeopardy-state-v2";
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
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

let state = loadState();
let currentClue = null; // { catIdx, value }

function cellKey(catIdx, value) { return `${catIdx}-${value}`; }
function hex(h) { return "#" + h; }

function showScreen(id) {
  document.querySelectorAll(".slide").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function renderScoreboard() {
  const el = document.getElementById("scoreboard");
  el.innerHTML = "";
  TEAMS.forEach(team => {
    const chip = document.createElement("div");
    chip.className = "score-chip";
    chip.innerHTML = `<span class="lbl">${team.label}</span><span>${state.scores[team.id] || 0}</span>`;
    el.appendChild(chip);
  });
}

function renderBoard() {
  const grid = document.getElementById("boardGrid");
  grid.innerHTML = "";

  CATEGORIES.forEach((cat, catIdx) => {
    const header = document.createElement("div");
    header.className = "cat-header";
    header.textContent = cat.name;
    header.style.left = BOARD_LAYOUT.colX[catIdx] + "%";
    header.style.top = BOARD_LAYOUT.headerY + "%";
    header.style.width = BOARD_LAYOUT.colW + "%";
    header.style.height = BOARD_LAYOUT.headerH + "%";
    header.style.background = hex(BOARD_LAYOUT.headerFill[catIdx]);
    header.style.color = hex(BOARD_LAYOUT.headerText[catIdx]);
    header.style.fontSize = `calc(var(--u) * ${(BOARD_LAYOUT.headerFontPt[catIdx] / 9.6).toFixed(3)})`;
    grid.appendChild(header);

    POINT_VALUES.forEach((value, rowIdx) => {
      const used = !!state.used[cellKey(catIdx, value)];
      const cell = document.createElement("div");
      cell.className = "point-cell" + (used ? " used" : "");
      cell.textContent = used ? "" : `$${value}`;
      cell.style.left = BOARD_LAYOUT.colX[catIdx] + "%";
      cell.style.top = BOARD_LAYOUT.rowY[rowIdx] + "%";
      cell.style.width = BOARD_LAYOUT.colW + "%";
      cell.style.height = BOARD_LAYOUT.rowH + "%";
      cell.style.background = hex(BOARD_LAYOUT.rowFill[rowIdx]);
      if (!used) cell.addEventListener("click", () => openClue(catIdx, value));
      grid.appendChild(cell);
    });
  });
}

function questionNumber(catIdx, value) {
  const rowIdx = POINT_VALUES.indexOf(value);
  return catIdx * 5 + rowIdx + 1;
}

function openClue(catIdx, value) {
  currentClue = { catIdx, value };
  const cat = CATEGORIES[catIdx];
  const data = cat.clues[value];
  const num = questionNumber(catIdx, value);

  document.getElementById("clueMeta").textContent = `${cat.name.toUpperCase()}   /   ${value} POINTS`;
  document.getElementById("clueNum").textContent = `Q${String(num).padStart(2, "0")}`;

  const body = document.getElementById("clueBody");
  if (data.emoji) {
    body.textContent = data.emoji;
    body.classList.add("emoji");
  } else {
    body.textContent = data.clue;
    body.classList.remove("emoji");
  }

  showScreen("screen-clue");
}

function revealAnswer() {
  const { catIdx, value } = currentClue;
  const cat = CATEGORIES[catIdx];
  const data = cat.clues[value];
  const num = questionNumber(catIdx, value);

  state.used[cellKey(catIdx, value)] = true;
  saveState();
  renderBoard();

  document.getElementById("ansMeta").textContent = `${cat.name.toUpperCase()}   /   ${value} POINTS`;
  document.getElementById("ansNum").textContent = `A${String(num).padStart(2, "0")}`;
  document.getElementById("ansName").textContent = data.answer;
  document.getElementById("ansTag").textContent = data.tag;

  const row = document.getElementById("awardRow");
  row.innerHTML = "";
  TEAMS.forEach(team => {
    const btn = document.createElement("button");
    btn.className = "award-btn";
    btn.textContent = `${team.label} +${value}`;
    btn.addEventListener("click", () => awardPoints(team.id, value));
    row.appendChild(btn);
  });
  const noneBtn = document.createElement("button");
  noneBtn.className = "award-btn none";
  noneBtn.textContent = "No one";
  noneBtn.addEventListener("click", () => showScreen("screen-board"));
  row.appendChild(noneBtn);

  showScreen("screen-answer");
}

function awardPoints(teamId, value) {
  state.scores[teamId] = (state.scores[teamId] || 0) + value;
  saveState();
  renderScoreboard();
  showScreen("screen-board");
}

// ---- nav buttons ----
document.getElementById("startBtn").addEventListener("click", () => showScreen("screen-board"));
document.getElementById("revealBtn").addEventListener("click", revealAnswer);
document.getElementById("backFromAnswerBtn").addEventListener("click", () => showScreen("screen-board"));
document.getElementById("boardFinishBtn").addEventListener("click", () => showScreen("screen-closing"));

document.getElementById("restartBtn").addEventListener("click", () => {
  const scores = {};
  TEAMS.forEach(t => scores[t.id] = 0);
  state = { used: {}, scores };
  saveState();
  renderBoard();
  renderScoreboard();
  showScreen("screen-title");
});

// ---- lightweight reset confirm (not part of the original deck, kept minimal) ----
const resetBtn = document.getElementById("boardResetBtn");
resetBtn.addEventListener("click", () => {
  if (resetBtn.dataset.armed === "1") {
    const scores = {};
    TEAMS.forEach(t => scores[t.id] = 0);
    state = { used: {}, scores };
    saveState();
    renderBoard();
    renderScoreboard();
    resetBtn.textContent = "Reset Game";
    resetBtn.dataset.armed = "0";
  } else {
    resetBtn.dataset.armed = "1";
    resetBtn.textContent = "Click again to confirm";
    setTimeout(() => {
      if (resetBtn.dataset.armed === "1") {
        resetBtn.dataset.armed = "0";
        resetBtn.textContent = "Reset Game";
      }
    }, 3000);
  }
});

renderBoard();
renderScoreboard();

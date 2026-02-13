const board = document.getElementById("board");
const champList = document.getElementById("champList");
const info = document.getElementById("infoPanel");
const traitsList = document.getElementById("traitsList");
const resetBtn = document.getElementById("resetBtn");

const TOTAL_CELLS = 28;

let boardState = Array(TOTAL_CELLS).fill(null);

/* =====================================================
   CREAR TABLERO
===================================================== */
for (let i = 0; i < TOTAL_CELLS; i++) {

  const cell = document.createElement("div");
  cell.className = "hex";
  cell.dataset.index = i;

  cell.addEventListener("dragover", e => e.preventDefault());

  cell.addEventListener("drop", e => {
    const type = e.dataTransfer.getData("type");

    /* ===== DESDE BANCO ===== */
    if (type === "bank") {
      const id = e.dataTransfer.getData("id");
      const champ = CHAMPIONS.find(c => c.id == id);

      boardState[i] = champ;
    }

    /* ===== DESDE TABLERO (MOVE REAL) ===== */
    if (type === "board") {
      const fromIndex = parseInt(e.dataTransfer.getData("from"));

      if (fromIndex === i) return;

      boardState[i] = boardState[fromIndex]; // mover
      boardState[fromIndex] = null;         // limpiar origen
    }

    renderBoard();
    calculateTraits();
  });

  board.appendChild(cell);
}

/* =====================================================
   RENDER TABLERO (draggable)
===================================================== */
function renderBoard() {

  document.querySelectorAll(".hex").forEach((cell, i) => {

    cell.innerHTML = "";

    const champ = boardState[i];
    if (!champ) return;

    const img = document.createElement("img");
    img.src = champ.img;
    img.draggable = true;

    img.addEventListener("dragstart", e => {
      e.dataTransfer.setData("type", "board");
      e.dataTransfer.setData("from", i);
    });

    img.addEventListener("click", () => showInfo(champ));

    cell.appendChild(img);
  });
}

/* =====================================================
   BANCO
===================================================== */
CHAMPIONS
  .sort((a, b) => a.cost - b.cost)
  .forEach(champ => {

    const card = document.createElement("div");
    card.className = "champ-card";
    card.draggable = true;

    card.innerHTML = `
      <img src="${champ.img}">
      <small>${champ.cost}⭐</small>
    `;

    card.addEventListener("dragstart", e => {
      e.dataTransfer.setData("type", "bank");
      e.dataTransfer.setData("id", champ.id);
    });

    card.addEventListener("click", () => showInfo(champ));

    champList.appendChild(card);
  });

/* =====================================================
   INFO
===================================================== */
function showInfo(champ) {
  info.innerHTML = `
    <img src="${champ.img}">
    <h3>${champ.name}</h3>
    <p>Costo: ${champ.cost}</p>
    <p>Rasgos: ${champ.traits.join(", ")}</p>
  `;
}

/* =====================================================
   SINERGIAS
===================================================== */
function calculateTraits() {

  const counts = {};

  boardState.forEach(champ => {
    if (!champ) return;

    champ.traits.forEach(trait => {
      counts[trait] = (counts[trait] || 0) + 1;
    });
  });

  traitsList.innerHTML = "";

  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([trait, count]) => {
      const li = document.createElement("li");
      li.textContent = `${trait} (${count})`;
      traitsList.appendChild(li);
    });
}

/* =====================================================
   RESET
===================================================== */
resetBtn.onclick = () => {
  boardState = Array(TOTAL_CELLS).fill(null);
  renderBoard();
  traitsList.innerHTML = "";
  info.innerHTML = "<p>Selecciona una unidad</p>";
};

/* =========================
   MOCK DATA
========================= */

const champions = [
  { id: "garen", name: "Garen", cost: 1, traits: ["Demacia"], img: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Garen.png" },
  { id: "lux", name: "Lux", cost: 2, traits: ["Demacia", "Hechicero"], img: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Lux.png" },
  { id: "ahri", name: "Ahri", cost: 3, traits: ["Hechicero"], img: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Ahri.png" },
  { id: "darius", name: "Darius", cost: 1, traits: ["Noxus"], img: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/Darius.png" }
];

/* =========================
   ELEMENTOS
========================= */

const board = document.getElementById("board");
const pool = document.getElementById("pool");
const traitList = document.getElementById("traitList");
const info = document.getElementById("info");
const resetBtn = document.getElementById("resetBtn");

/* =========================
   BOARD
========================= */

function createBoard() {
  for (let i = 0; i < 28; i++) {
    const hex = document.createElement("div");
    hex.className = "hex";

    hex.addEventListener("dragover", e => e.preventDefault());

    hex.addEventListener("drop", e => {
      const id = e.dataTransfer.getData("text/plain");
      const unit = document.getElementById(id);

      if (!unit) return;

      // si ya había uno, swap
      if (hex.firstChild) {
        const old = hex.firstChild;
        unit.parentNode.appendChild(old);
      }

      hex.appendChild(unit);
      updateTraits();
    });

    board.appendChild(hex);
  }
}

/* =========================
   POOL
========================= */

function createPool() {
  champions.sort((a, b) => a.cost - b.cost);

  champions.forEach(c => {
    const img = document.createElement("img");

    img.src = c.img;
    img.id = "unit-" + c.id;
    img.className = "unit";
    img.draggable = true;

    img.dataset.traits = JSON.stringify(c.traits);
    img.dataset.cost = c.cost;
    img.dataset.name = c.name;

    img.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", img.id);
    });

    img.addEventListener("click", () => showInfo(img));

    pool.appendChild(img);
  });
}

/* =========================
   INFO PANEL
========================= */

function showInfo(unit) {
  const traits = JSON.parse(unit.dataset.traits);

  info.innerHTML = `
    <img src="${unit.src}" width="100"><br>
    <strong>${unit.dataset.name}</strong><br>
    Coste: ${unit.dataset.cost}<br>
    Rasgos: ${traits.join(", ")}
  `;
}

/* =========================
   SINERGIAS
========================= */

function updateTraits() {
  const counts = {};

  document.querySelectorAll(".hex .unit").forEach(u => {
    const traits = JSON.parse(u.dataset.traits);

    traits.forEach(t => {
      counts[t] = (counts[t] || 0) + 1;
    });
  });

  traitList.innerHTML = "";

  Object.entries(counts).forEach(([t, n]) => {
    const p = document.createElement("p");
    p.textContent = `${t}: ${n}`;
    traitList.appendChild(p);
  });
}

/* =========================
   RESET
========================= */

resetBtn.addEventListener("click", () => {
  document.querySelectorAll(".unit").forEach(u => pool.appendChild(u));
  traitList.innerHTML = "";
  info.innerHTML = "Selecciona un campeón";
});

/* =========================
   INIT
========================= */

createBoard();
createPool();



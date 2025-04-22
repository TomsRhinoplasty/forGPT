// public/src/main.js
import * as d3          from "https://unpkg.com/d3?module";
import { debounce }     from "./utils/debounce.js";
import { uid }          from "./utils/uid.js";
import { config }       from "./config.js";
import { mainNodes as defaultMap } from "./data.js";

import { initDiagramController }  from "./controllers/diagramController.js";
import { initNodeController }     from "./controllers/nodeController.js";
import { initToolbarController }  from "./controllers/toolbarController.js";
import { initChatController }     from "./controllers/chatController.js";

// ───────── Globals & Initial State ─────────────────────────
window.clientID        = Math.random().toString(36).substr(2, 9);
let currentMapData     = JSON.parse(JSON.stringify(defaultMap));
let currentDetailLevel = 0;
let manualInteraction  = false;

window.savedMapId     = null;
window.currentMapName = "Default Map";
window.lastSavedMap   = null;

// ───────── Helper Functions ─────────────────────────────────
function newMap() {
  const mkGc = (p,i) => ({
    id: uid("gc"), title: `Grandchild ${i}`, role: "human", desc: "", children: []
  });
  const mkC = id => ({
    id, title: "Child", role: "human", desc: "",
    children: [1,2,3].map(i => mkGc(id + i, i))
  });
  return [
    {
      id: uid("a"), title: "Main A", role: "human", desc: "",
      children: [uid("a1"), uid("a2"), uid("a3")].map(mkC)
    },
    { id: uid("b"), title: "Main B", role: "human", desc: "", children: [] }
  ];
}

function renderToolbarStatus() {
  const status = document.getElementById("toolbarStatus");
  const userEmail = localStorage.getItem("userEmail") || "Guest";
  status.innerHTML = `
    <span style="margin-right:1em;">
      Map: <strong>${window.currentMapName}</strong>
    </span>
    <span style="margin-right:1em;">
      User: <strong>${userEmail}</strong>
    </span>
    <button id="logoutButton">Logout</button>
  `;
  document.getElementById("logoutButton").onclick = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    window.location.href = "login.html";
  };
}

function reloadDiagram(data) {
  context.currentMapData = data;
  context.updateDiagram();
  renderToolbarStatus();
}

function computeBounds() {
  // replicate old bounds() logic
  let minX=Infinity, maxX=-Infinity, minY=Infinity, maxY=-Infinity;
  context.allNodes.forEach(n => {
    minX = Math.min(minX, n.x - config.mainRadius);
    maxX = Math.max(maxX, n.x + config.mainRadius);
    minY = Math.min(minY, n.y - config.mainRadius);
    maxY = Math.max(maxY, n.y + config.mainRadius);
  });
  return { x:minX, y:minY, width:maxX-minX, height:maxY-minY };
}

function applyRoleUpdates(updates) {
  // replicate old applyRoleUpdates()
  context.allNodes.forEach(n => {
    if (updates[n.id]) {
      n.role = updates[n.id];
    }
  });
  context.updateDiagram();
}

// ───────── Build the “context” for all controllers ─────────────
const context = {
  // state
  get currentMapData()    { return currentMapData; },
  set currentMapData(v)   { currentMapData = v; },
  get currentDetailLevel(){ return currentDetailLevel; },
  setDetailLevel(v)       { currentDetailLevel = v; },
  get manualInteraction() { return manualInteraction; },
  set manualInteraction(v){ manualInteraction = v; },

  // helpers & services
  newMap,
  reloadDiagram,
  applyRoleUpdates,
  renderToolbarStatus,
  computeBounds,

  // utilities
  debounce,

  // placeholders — filled in by diagramController
  updateDiagram:    () => {},
  allNodes:         [],

  // zoom behavior — used by diagramController
  zoomBehavior:     d3.zoom().on("zoom", e => {
    if (e.sourceEvent) context.manualInteraction = true;
    d3.select("g").attr("transform", e.transform);
  }),

  // autoZoom used by uiAdapter’s initDrawer & reset‑zoom button
  autoZoom: () => context.updateDiagram(),
};

// ───────── Initialize All Controllers ────────────────────────
initDiagramController(context);
initNodeController(context);
initToolbarController(context);
initChatController(context);

// ───────── Final Kickoff ────────────────────────────────────
renderToolbarStatus();

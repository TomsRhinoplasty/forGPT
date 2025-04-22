// public/js/main.js ― orchestration, UI wiring & streaming ChatGPT integration

import * as d3 from "https://unpkg.com/d3?module";
import { debounce }    from "./debounce.js";
import { initDrawer }  from "./drawer.js";
import { mainNodes as defaultMap } from "./data.js";
import { computeLayout }  from "./layout.js";
import { gatherConnectors } from "./nodes.js";
import {
  bindTooltip,
  initZoom,
  bindExpandCollapse,
  bindNodeEvents,
  bindBackgroundDblClick,
  saveMap,
  saveMapAsNew,
  showMapLibrary,
  editInlineText
} from "./interactions.js";
import { animateZoomToBounds, startAnimationLoop } from "./animation.js";
import { config }       from "./config.js";
import { emitMapUpdate, onMapUpdate } from "./realtime.js";

// ───────────────────────── Globals & SVG ─────────────────────────
window.clientID         = Math.random().toString(36).substr(2, 9);
let   currentMapData    = JSON.parse(JSON.stringify(defaultMap));
let   currentDetailLevel = 0;
let   manualInteraction  = false;

let allNodes = [], nodeSel, linkSel;
window.savedMapId     = null;
window.currentMapName = "Default Map";
window.lastSavedMap   = null;

const mapContainer = document.getElementById("mapContainer");
const svg          = d3.select("#map")
                       .attr("width", mapContainer.clientWidth)
                       .attr("height", mapContainer.clientHeight);
const g            = svg.append("g");
const linkGroup    = g.append("g").attr("class","links");
const nodeGroup    = g.append("g").attr("class","nodes");

// ───────────── Utility – strip & broadcast ───────────────────
const strip = n => ({
  id:       n.id,
  title:    n.title,
  role:     n.role,
  desc:     n.desc,
  children: (n.children||[]).map(strip)
});
function updateBlueprint() {
  const clean = currentMapData.map(strip);
  localStorage.setItem("currentMapData", JSON.stringify(clean));
  emitMapUpdate(clean, window.clientID);
}

// ───────────── Transform‑only update ─────────────────────────
function updatePositionsOnly() {
  nodeGroup.selectAll("g.node")
    .attr("transform", d => `translate(${d.currentX},${d.currentY})`);
  linkGroup.selectAll("line.link")
    .attr("x1", d => d.source.currentX)
    .attr("y1", d => d.source.currentY)
    .attr("x2", d => d.target.currentX)
    .attr("y2", d => d.target.currentY);
}

// ───────────── Diagram refresh & fitting ─────────────────────
function refreshDiagram() {
  allNodes = computeLayout(currentMapData, currentDetailLevel, config);
  allNodes.forEach(d => {
    if (d.currentX === undefined) {
      d.currentX = d.x;
      d.currentY = d.y;
    }
  });
  const connectors = gatherConnectors(currentMapData, currentDetailLevel);
  linkSel = linkGroup.selectAll("line.link")
    .data(connectors, d => d.source.id + "-" + d.target.id);
  linkSel.exit().remove();
  linkSel = linkSel.enter().append("line")
    .attr("class","link")
    .merge(linkSel);

  bindNodeEvents(nodeGroup, context);
  updateBlueprint();
  debouncedAutoZoom();
}

function initSelections() {
  nodeSel = nodeGroup.selectAll("g.node")
    .data(allNodes, d => d.id);
  nodeSel.exit().remove();

  const enter = nodeSel.enter().append("g")
    .attr("class", d => `node ${d.role}`)
    .attr("transform", d => `translate(${d.currentX},${d.currentY})`);
  enter.append("circle").attr("r", 0);
  enter.append("text")
       .attr("dy", d =>
         d.depth === 0
           ? config.mainRadius + 20
           : d.depth === 1
             ? config.subRadius + 20
             : config.subSubRadius + 20
       )
       .attr("text-anchor","middle")
       .text(d => d.title.trim() || config.defaultEmptyText);
  enter.append("rect")
       .attr("class","editOverlay")
       .style("fill","transparent")
       .style("pointer-events","all");

  nodeSel = enter.merge(nodeSel);
  nodeSel.each(function(d){
    const txt = d3.select(this).select("text").node();
    const bb  = txt.getBBox();
    const w   = d.title.trim() ? bb.width : config.defaultEmptyWidth;
    const h   = d.title.trim() ? bb.height : config.defaultEmptyHeight;
    d3.select(this).select("rect.editOverlay")
      .attr("x", -w/2)
      .attr("y", bb.y)
      .attr("width", w)
      .attr("height", h);
  });

  bindNodeEvents(nodeGroup, context);
  linkSel = linkGroup.selectAll("line.link");
  updateBlueprint();
}

function updateDiagram() {
  refreshDiagram();
  initSelections();
  const max = Math.max(...allNodes.map(n => n.depth));
  if (currentDetailLevel > max) {
    context.setDetailLevel(max);
  }
  kickAnimation();
}

// ─────────── New‑map template & reload ─────────────────────────
function uid(p = "m") {
  return p + Math.random().toString(36).slice(2,10);
}
function newMap() {
  const mkGc = (p,i) => ({
    id: uid("gc"),
    title: `Grandchild ${i}`,
    role: "human",
    desc: "",
    children: []
  });
  const mkC = id => ({
    id, title: "Child", role: "human", desc: "",
    children: [1,2,3].map(i => mkGc(id + i, i))
  });
  return [
    {
      id: uid("a"),
      title: "Main A",
      role: "human",
      desc: "",
      children: [uid("a1"), uid("a2"), uid("a3")].map(mkC)
    },
    { id: uid("b"), title: "Main B", role: "human", desc: "", children: [] }
  ];
}
function reloadDiagram(data) {
  currentMapData = data;
  updateDiagram();
  renderToolbarStatus();
}

// ───────────── Auto‑zoom (debounced) ─────────────────────────
function bounds() {
  let minX=Infinity, maxX=-Infinity, minY=Infinity, maxY=-Infinity;
  allNodes.forEach(n => {
    minX = Math.min(minX, n.x - config.mainRadius);
    maxX = Math.max(maxX, n.x + config.mainRadius);
    minY = Math.min(minY, n.y - config.mainRadius);
    maxY = Math.max(maxY, n.y + config.mainRadius);
  });
  return { x:minX, y:minY, width:maxX-minX, height:maxY-minY };
}
function autoZoom() {
  if (manualInteraction) return;
  const b = bounds();
  setTimeout(() => {
    animateZoomToBounds(
      svg, zoomBehavior,
      b, 500,
      mapContainer.clientWidth, mapContainer.clientHeight
    );
  }, 20);
}
const debouncedAutoZoom = debounce(autoZoom, 200);

// ───────────── Zoom & pan setup ───────────────────────────────
const zoomBehavior = d3.zoom().on("zoom", e => {
  if (e.sourceEvent) manualInteraction = true;
  g.attr("transform", e.transform);
});
initZoom(svg, g, zoomBehavior);
svg.on("dblclick.zoom", null);

// ───────── Tooltip & Context & Status ─────────────────────────
bindTooltip(g, d3.select("#tooltip"));
function renderToolbarStatus() {
  const status = document.getElementById("toolbarStatus");
  const userEmail = localStorage.getItem("userEmail") || "Guest";
  status.innerHTML = `
    <span style="margin-right:1em;">Map: <strong>${window.currentMapName}</strong></span>
    <span style="margin-right:1em;">User: <strong>${userEmail}</strong></span>
    <button id="logoutButton">Logout</button>
  `;
  document.getElementById("logoutButton").onclick = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    window.location.href = "login.html";
  };
}

const context = {
  get currentDetailLevel(){ return currentDetailLevel; },
  setDetailLevel: v => currentDetailLevel = v,
  get currentMapData(){ return currentMapData; },
  set currentMapData(v){ currentMapData = v; },
  refreshDiagram, updateBlueprint,
  mainUpdatePositionsOnly: updatePositionsOnly,
  autoZoom: debouncedAutoZoom,
  manualInteraction,
  get allNodes(){ return allNodes; },
  get nodeSel(){ return nodeSel; },
  get linkSel(){ return linkSel; },
  zoomBehavior, updateDiagram,
  addNewMainNode: n => { currentMapData.push(n); updateDiagram(); },
  reloadDiagram
};

// ───────── Event bindings ─────────────────────────────────────
bindBackgroundDblClick(svg, context);

// Expand/Collapse
const expBtn = d3.select("#expandButton");
const colBtn = d3.select("#collapseButton");
if (expBtn.empty() || colBtn.empty()) {
  console.error("⚠️ Missing #expandButton or #collapseButton in DOM");
}
bindExpandCollapse(expBtn, colBtn, updateDiagram, context);

document.getElementById("resetZoom").onclick = () => { manualInteraction = false; autoZoom(); };
document.getElementById("saveNowButton").onclick = () => saveMap(context);
document.getElementById("saveAsNewMapButton").onclick = () => saveMapAsNew(context);
document.getElementById("loadMapButton").onclick = async () => {
  await showMapLibrary(context);
  renderToolbarStatus();
};
document.getElementById("newMapButton").onclick = () => {
  currentMapData = newMap();
  updateDiagram();
  renderToolbarStatus();
};
document.getElementById("undoButton").onclick = () => {
  if (window.lastSavedMap) reloadDiagram(window.lastSavedMap);
};
window.addEventListener("resize", debounce(() => {
  manualInteraction = false;
  debouncedAutoZoom();
}, 200));

initDrawer(mapContainer, svg, context);

// ───────── Animation loop startup ───────────────────────────
let kickAnimation = startAnimationLoop(context);

// ─────────── Startup ─────────────────────────────────────────
updateDiagram();
renderToolbarStatus();
onMapUpdate(data => {
  if (data.origin !== window.clientID) {
    reloadDiagram(data.blueprint);
    manualInteraction = false;
  }
});

// ─────────── Chat Drawer Logic (stream & parse at end) ─────────────────────────
const chatLog   = document.getElementById("chatLog");
const chatInput = document.getElementById("chatInput");
const chatSend  = document.getElementById("chatSendButton");

// Apply role updates after parsing final JSON
function applyRoleUpdates(updates) {
  allNodes.forEach(n => {
    if (updates[n.id]) {
      n.role = updates[n.id];
    }
  });
  updateDiagram();
}

async function sendChat() {
  const question = chatInput.value.trim();
  if (!question) return;

  // User message
  const um = document.createElement("div");
  um.className = "chat-message user-message";
  um.textContent = question;
  chatLog.appendChild(um);
  chatLog.scrollTop = chatLog.scrollHeight;
  chatInput.value = "";

  // Bot container
  const bm = document.createElement("div");
  bm.className = "chat-message bot-message";
  chatLog.appendChild(bm);

  try {
    const res = await fetch("/api/llm/query", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        mapData: currentMapData.map(strip)
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Stream and build up full text
    const reader  = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false, buffer = "";

    while (!done) {
      const { value, done: d } = await reader.read();
      done = d;
      if (value) {
        buffer += decoder.decode(value);
        bm.textContent = buffer;
        chatLog.scrollTop = chatLog.scrollHeight;
      }
    }

    // Once stream ends, parse out the last JSON block
    const marker = "UPDATE_MAP_ROLES:";
    const idx = buffer.lastIndexOf(marker);
    if (idx !== -1) {
      const jsonText = buffer.slice(idx + marker.length).trim();
      try {
        const updates = JSON.parse(jsonText);
        applyRoleUpdates(updates);
      } catch (err) {
        console.warn("Failed to parse role-update JSON:", err);
      }
      // Remove the marker+JSON from what the user sees
      bm.textContent = buffer.slice(0, idx);
    }
  } catch (err) {
    console.error("Chat error:", err);
    const em = document.createElement("div");
    em.className = "chat-message bot-message";
    em.textContent = `Error: ${err.message}`;
    chatLog.appendChild(em);
    chatLog.scrollTop = chatLog.scrollHeight;
  }
}

chatSend.onclick = sendChat;
chatInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendChat();
  }
});

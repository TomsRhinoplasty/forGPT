// public/js/interactions.js

// Stub for command execution (in-browser)
window.executeCommand = function(cmd, args) {
  console.log(`executeCommand called with command: ${cmd}`, args);
};

import * as d3 from "https://unpkg.com/d3?module";
import { config } from "./config.js";

/* 1. Depth‑helpers */
function depth(node) {
  if (!node.children || node.children.length === 0) return 0;
  return 1 + Math.max(...node.children.map(depth));
}
export function getTreeDepth(nodes) {
  return Math.max(...nodes.map(depth));
}

/* 2. Tooltip & Zoom */
export function bindTooltip(g, tooltip) {
  g.selectAll("g.node")
    .on("mouseover", (e, d) =>
      tooltip.style("display", "block")
             .html(`Title: ${d.title}<br/>Role: ${d.role}`))
    .on("mousemove", e =>
      tooltip.style("left", `${e.pageX + 10}px`)
             .style("top",  `${e.pageY + 10}px`))
    .on("mouseout", () => tooltip.style("display", "none"));
}
export function initZoom(svg, g, zoomBhv) {
  svg.call(zoomBhv);
}

/* 3. Expand / collapse buttons */
export function bindExpandCollapse(btnExp, btnCol, updateDiagram, ctx) {
  btnExp.on("click", () => {
    const max = getTreeDepth(ctx.currentMapData);
    if (ctx.currentDetailLevel < max) {
      ctx.setDetailLevel(ctx.currentDetailLevel + 1);
      updateDiagram();
    }
  });
  btnCol.on("click", () => {
    if (ctx.currentDetailLevel > 0) {
      ctx.setDetailLevel(ctx.currentDetailLevel - 1);
      updateDiagram();
    }
  });
}

/* 4. Inline‑text editing */
export function editInlineText(textElem, d, ctx) {
  // Hide original text and show an input overlay
  d3.select(textElem).style("visibility", "hidden");
  const bb = textElem.getBoundingClientRect();
  const input = d3.select("body").append("input")
    .attr("type", "text")
    .style("position", "absolute")
    .style("left",   `${bb.left}px`)
    .style("top",    `${bb.top}px`)
    .style("width",  `${bb.width + 10}px`)
    .style("height", `${bb.height + 4}px`)
    .style("font-size",  "14px")
    .style("font-family","sans-serif")
    .node();

  input.value = d.title;
  input.focus();
  input.select();

  function cleanup(commit) {
    if (commit) {
      // Update the data model
      d.title = input.value.trim();
      // Immediately update the on-screen text element
      d3.select(textElem)
        .text(d.title || config.defaultEmptyText);
    }
    // Remove the input overlay and show the text
    d3.select(input).remove();
    d3.select(textElem).style("visibility", null);
    if (commit) ctx.updateDiagram();
  }

  input.addEventListener("keydown", e => {
    if      (e.key === "Enter")  cleanup(true);
    else if (e.key === "Escape") cleanup(false);
  });
  input.addEventListener("blur", () => cleanup(true));
}

/* 5. Node create / drag / delete */
// Sprout child with deferred update so rapid clicks aren’t dropped
export function sproutChildNode(parent, ctx) {
  const n = {
    id:       "n" + Date.now(),
    title:    "New Child",
    role:     "hybrid",
    desc:     "",
    children: [],
    x:        parent.x + config.mainSpacing / 4,
    y:        parent.y + config.verticalSpacing,
    currentX: parent.x + config.mainSpacing / 4,
    currentY: parent.y + config.verticalSpacing,
    depth:    (parent.depth || 0) + 1
  };
  parent.children = parent.children || [];
  parent.children.push(n);
  if (n.depth > ctx.currentDetailLevel) {
    ctx.setDetailLevel(n.depth);
  }
  setTimeout(() => {
    if (ctx.updateDiagram) ctx.updateDiagram();
    else ctx.refreshDiagram();
  }, 0);
}

export function dragStarted(e, d) {
  d3.select(this).raise().classed("active", true);
  d._initX = d.x;
  d._initY = d.y;
}

export function dragged(e, d, ctx) {
  d.x = e.x;
  d.y = e.y;
  d.currentX = d.x;
  d.currentY = d.y;

  d3.select(this).attr("transform", `translate(${d.currentX},${d.currentY})`);

  if (d._initX !== undefined) {
    const dist = Math.hypot(d.x - d._initX, d.y - d._initY);
    d3.select(this).classed("toDelete", dist > config.deletionThreshold);
  }

  ctx.mainUpdatePositionsOnly();
}

export function dragEnded(e, d, ctx) {
  const dist = d._initX !== undefined
    ? Math.hypot(d.x - d._initX, d.y - d._initY)
    : 0;

  d3.select(this).classed("active", false).classed("toDelete", false);
  if (dist > config.deletionThreshold) {
    deleteNode(d, ctx);
  } else {
    d.x = d._initX;
    d.y = d._initY;
    d.currentX = d._initX;
    d.currentY = d._initY;
    ctx.updateDiagram();
  }
  delete d._initX;
  delete d._initY;
}

export function deleteNode(node, ctx) {
  function remove(arr, id) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) { arr.splice(i, 1); return true; }
      if (arr[i].children && remove(arr[i].children, id)) return true;
    }
    return false;
  }
  if (remove(ctx.currentMapData, node.id)) {
    if (ctx.updateDiagram) ctx.updateDiagram();
    else ctx.refreshDiagram();
  }
}

export function bindNodeEvents(nodeGrp, ctx) {
  // Dragging
  nodeGrp.selectAll("g.node")
    .call(d3.drag()
      .on("start", (e, d) => dragStarted.call(this, e, d))
      .on("drag",  (e, d) => dragged.call(this, e, d, ctx))
      .on("end",   (e, d) => dragEnded.call(this, e, d, ctx))
    );

  // Instant “double‑click” logic on circles
  nodeGrp.selectAll("g.node circle")
    .on("click", (e, d) => {
      if (e.detail % 2 === 0) {
        e.stopPropagation();
        sproutChildNode(d, ctx);
      }
    });

  // Text/rect editing still uses native dblclick
  nodeGrp.selectAll("g.node text, g.node rect.editOverlay")
    .style("pointer-events", "all")
    .style("cursor", "text")
    .on("dblclick", (e, d) => {
      e.stopPropagation();
      const txt = d3.select(e.currentTarget.parentNode).select("text").node();
      editInlineText(txt, d, ctx);
    });
}

/* 6. Background click to add main nodes instantly */
export function bindBackgroundDblClick(svg, ctx) {
  svg.on("click", e => {
    if (e.detail % 2 !== 0) return;
    if (e.target !== svg.node()) return;

    const pt = svg.node().createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const c = pt.matrixTransform(svg.node().getScreenCTM().inverse());

    const n = {
      id:       "n" + Date.now(),
      title:    "New Node",
      role:     "hybrid",
      desc:     "",
      children: [],
      x:        c.x,
      y:        c.y,
      currentX: c.x,
      currentY: c.y,
      depth:    0
    };
    if (ctx.addNewMainNode) ctx.addNewMainNode(n);
    else {
      ctx.currentMapData.push(n);
      ctx.refreshDiagram();
    }
  });
}

/* 7. Reset‑zoom */
export function bindResetZoom(btn, ctx) {
  btn.on("click", () =>
    d3.select("svg").transition().duration(500)
      .call(ctx.zoomBehavior.transform, d3.zoomIdentity)
  );
}

/* 8. Modal & Toast helpers */
function customModal({ title, bodyHTML, cancel = true }) {
  return new Promise(res => {
    const modal     = document.getElementById("customModal"),
          titleEl   = document.getElementById("customModalTitle"),
          bodyEl    = document.getElementById("customModalBody"),
          x         = document.getElementById("customModalClose"),
          ok        = document.getElementById("customModalOk"),
          cancelBtn = document.getElementById("customModalCancel");

    titleEl.innerText = title;
    bodyEl.innerHTML  = bodyHTML;
    cancelBtn.style.display = cancel ? "inline-block" : "none";
    modal.classList.remove("hidden");

    const done = v => {
      modal.classList.add("hidden");
      [x, ok, cancelBtn].forEach(b => (b.onclick = null));
      res(v);
    };
    x.onclick         = () => done(cancel ? false : null);
    cancelBtn.onclick = () => done(false);
    ok.onclick        = () => {
      const inp = document.getElementById("customModalInput");
      done(inp ? inp.value.trim() : true);
    };
  });
}
export const showModalPrompt  = (t, d = "") =>
  customModal({ title: t, bodyHTML: `<input id="customModalInput" style="width:100%" value="${d}">`, cancel: true })
    .then(v => (v === "" ? null : v));
export const showModalConfirm = (t, m) =>
  customModal({ title: t, bodyHTML: `<p>${m}</p>`, cancel: true });
export const showModalInfo    = (t, m) =>
  customModal({ title: t, bodyHTML: `<p>${m}</p>`, cancel: false });

export function showToast(message) {
  let toast = document.getElementById("globalToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id        = "globalToast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

/* 9. Save / Load / Library helpers */
const stripForSave = n => ({
  id:       n.id,
  title:    n.title,
  role:     n.role,
  desc:     n.desc,
  children: (n.children || []).map(stripForSave)
});

export async function saveMapAsNew(ctx) {
  const name = await showModalPrompt("Enter a name for your map:", "My Map");
  if (!name) return;
  window.currentMapName = name;
  const token = localStorage.getItem("authToken");
  try {
    const res = await fetch("/api/maps", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name, data: ctx.currentMapData.map(stripForSave) })
    });
    if (!res.ok) {
      const err = await res.json();
      await showModalInfo("Save Failed", err.error || `Server ${res.status}`);
      return;
    }
    const json = await res.json();
    window.savedMapId = json.map._id;
    showToast("Map saved!");
    clearTimeout(ctx.autoSaveTimeout);
    scheduleAutoSave(ctx);
  } catch (err) {
    await showModalInfo("Save Failed", err.message);
  }
}

export async function saveMap(ctx) {
  if (!window.savedMapId) return saveMapAsNew(ctx);
  await autoSave(ctx);
  showToast("Map saved!");
}

export function autoSave(ctx) {
  if (!window.savedMapId) return;
  const token = localStorage.getItem("authToken");
  return fetch(`/api/maps/${window.savedMapId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      name: window.currentMapName || "My Map",
      data: ctx.currentMapData.map(stripForSave)
    })
  })
  .then(r => r.ok ? r.json() : null)
  .then(() => { window.lastSavedMap = ctx.currentMapData.map(stripForSave); });
}

export function scheduleAutoSave(ctx) {
  clearTimeout(ctx.autoSaveTimeout);
  if (window.savedMapId) {
    ctx.autoSaveTimeout = setTimeout(() => autoSave(ctx), 3000);
  }
}

export async function showMapLibrary(ctx) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    await showModalInfo("Not Logged In", "Please log in to load your maps.");
    window.location.href = "login.html";
    return;
  }

  const modal    = document.getElementById("mapLibraryModal");
  const list     = document.getElementById("mapList");
  const closeBtn = document.getElementById("closeModal");
  closeBtn.onclick = () => modal.classList.add("hidden");

  async function renderList() {
    list.innerHTML = "";
    let res;
    try {
      res = await fetch("/api/maps", { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      await showModalInfo("Network Error", err.message);
      return;
    }
    if (!res.ok) {
      await showModalInfo(
        "Error Loading Maps",
        `Server responded with ${res.status} ${res.statusText}`
      );
      return;
    }
    let maps;
    try {
      maps = await res.json();
    } catch {
      await showModalInfo("Error", "Invalid JSON from server.");
      return;
    }
    maps.forEach(m => {
      const row = document.createElement("div");
      row.className = "mapItem";

      const name = document.createElement("span");
      name.className = "mapName";
      name.textContent = m.name;
      name.onclick = () => loadMap(m);
      row.onclick  = () => loadMap(m);

      const trash = document.createElement("span");
      trash.className = "trashBtn";
      trash.innerHTML = "🗑️";
      trash.title     = "Delete map";
      trash.onclick   = async ev => { /* deletion logic */ };

      row.appendChild(name);
      row.appendChild(trash);
      list.appendChild(row);
    });
  }

  function loadMap(m) {
    const clean = JSON.parse(JSON.stringify(m.data));
    ctx.reloadDiagram(clean);
    window.savedMapId     = m._id;
    window.currentMapName = m.name;
    modal.classList.add("hidden");
  }

  modal.classList.remove("hidden");
  await renderList();
}

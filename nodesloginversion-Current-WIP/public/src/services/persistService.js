// src/services/persistService.js

import {
  showModalPrompt,
  showModalInfo,
  showToast
} from "../adapters/uiAdapter.js";

/**
 * Prepare a node for saving by stripping out runtime properties.
 */
const stripForSave = n => ({
  id:       n.id,
  title:    n.title,
  role:     n.role,
  desc:     n.desc,
  children: (n.children || []).map(stripForSave)
});

/**
 * Save a brand‑new map (POST).
 * Prompts user for a name, then sends to /api/maps.
 */
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
      body: JSON.stringify({
        name,
        data: ctx.currentMapData.map(stripForSave)
      })
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

/**
 * Save the existing map (PUT) or fallback to saving new.
 */
export async function saveMap(ctx) {
  if (!window.savedMapId) return saveMapAsNew(ctx);
  await autoSave(ctx);
  showToast("Map saved!");
}

/**
 * Auto‑save (PUT) after initial saveMapAsNew.
 */
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
    .then(r => (r.ok ? r.json() : null))
    .then(() => {
      window.lastSavedMap = ctx.currentMapData.map(stripForSave);
    });
}

/**
 * Schedule an auto‑save in 3 seconds, clearing any prior timeout.
 */
export function scheduleAutoSave(ctx) {
  clearTimeout(ctx.autoSaveTimeout);
  if (window.savedMapId) {
    ctx.autoSaveTimeout = setTimeout(() => autoSave(ctx), 3000);
  }
}

/**
 * Show the user’s saved‐map library in a modal and let them load one.
 */
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
      res = await fetch("/api/maps", {
        headers: { Authorization: `Bearer ${token}` }
      });
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

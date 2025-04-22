// public/src/controllers/toolbarController.js

import {
  saveMap,
  saveMapAsNew,
  showMapLibrary
} from "../services/persistService.js";
import { showModalConfirm } from "../adapters/uiAdapter.js";

/**
 * Wires up the Save, Save As New, Load, New, and Undo buttons in your toolbar.
 */
export function initToolbarController(context) {
  document.getElementById("saveNowButton").onclick = () =>
    saveMap(context);

  document.getElementById("saveAsNewMapButton").onclick = () =>
    saveMapAsNew(context);

  document.getElementById("loadMapButton").onclick = async () => {
    await showMapLibrary(context);
  };

  document.getElementById("newMapButton").onclick = async () => {
    const ok = await showModalConfirm(
      "Create New Map",
      "Any unsaved changes will be lost. Continue?"
    );
    if (ok) {
      context.currentMapData = context.newMap();
      context.updateDiagram();
    }
  };

  document.getElementById("undoButton").onclick = () => {
    if (window.lastSavedMap) {
      context.reloadDiagram(window.lastSavedMap);
    }
  };
}

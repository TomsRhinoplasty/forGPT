// public/src/controllers/nodeController.js

import * as d3 from "https://unpkg.com/d3?module";
import { bindAllNodeEvents } from "../adapters/nodeEvents.js";

/**
 * Wires up all node interactions: drag, double‑click to sprout, and inline text editing.
 */
export function initNodeController(context) {
  // Select the <g class="nodes"> group that holds all your node <g> elements:
  const nodeGroup = d3.select("#map").select("g.nodes");

  // Bind all the D3 event handlers in one shot:
  bindAllNodeEvents(nodeGroup, context);
}

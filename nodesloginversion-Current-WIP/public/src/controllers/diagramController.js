// public/src/controllers/diagramController.js

import * as d3 from "https://unpkg.com/d3?module";
import { computeLayout }       from "../domain/layout.js";
import { gatherConnectors }    from "../domain/nodes.js";
import { bindNodeEvents }      from "../adapters/nodeEvents.js";
import {
  bindTooltip,
  initZoom,
  bindExpandCollapse,
  bindBackgroundDblClick,
  saveMap,
  saveMapAsNew,
  showMapLibrary
} from "../adapters/interactions.js";
import { animateZoomToBounds, startAnimationLoop } from "../adapters/d3Adapter.js";
import { emitMapUpdate, onMapUpdate }             from "../services/realtime.js";
import { config }           from "../config.js";

// Initializes the diagram: wiring up layout, zoom, pan, D3 selections, and auto‑save.
export function initDiagramController(context) {
  const svg        = d3.select("#map");
  const g          = svg.select("g");
  const linkGroup  = g.select("g.links");
  const nodeGroup  = g.select("g.nodes");
  const mapContainer = document.getElementById("mapContainer");

  // 1. Setup zoom & pan
  initZoom(svg, g, context.zoomBehavior);
  svg.on("dblclick.zoom", null);

  // 2. Bind tooltip
  bindTooltip(g, d3.select("#tooltip"));

  // 3. Event wiring for Expand/Collapse buttons
  bindExpandCollapse(
    d3.select("#expandButton"),
    d3.select("#collapseButton"),
    context.updateDiagram,
    context
  );

  // 4. Reset Zoom button
  document.getElementById("resetZoom").onclick = () => {
    context.manualInteraction = false;
    context.autoZoom();
  };

  // 5. Save / Load / New / Undo
  document.getElementById("saveNowButton").onclick       = () => saveMap(context);
  document.getElementById("saveAsNewMapButton").onclick  = () => saveMapAsNew(context);
  document.getElementById("loadMapButton").onclick       = async () => {
    await showMapLibrary(context);
  };
  document.getElementById("newMapButton").onclick        = () => {
    context.currentMapData = context.newMap();
    context.updateDiagram();
  };
  document.getElementById("undoButton").onclick          = () => {
    if (window.lastSavedMap) context.reloadDiagram(window.lastSavedMap);
  };

  // 6. Drawer (chat) integration
  //    Note: initDrawer returns an object with applyLayout()
  //    but initDrawer also calls context.autoZoom() internally
  import("../adapters/uiAdapter.js").then(m => {
    m.initDrawer(mapContainer, svg, context);
  });

  // 7. Auto‑zoom on resize
  window.addEventListener("resize", context.debounce(() => {
    context.manualInteraction = false;
    context.autoZoom();
  }, 200));

  // 8. Animation loop
  const kickAnimation = startAnimationLoop(context);

  // ─── Core rendering logic, extracted from old main.js ─────────────────

  function updateBlueprint() {
    const clean = context.currentMapData.map(n => ({
      id:    n.id,
      title: n.title,
      role:  n.role,
      desc:  n.desc,
      children: (n.children || []).map(c => ({
        id:    c.id,
        title: c.title,
        role:  c.role,
        desc:  c.desc,
        children: [] // just one level deep
      }))
    }));
    localStorage.setItem("currentMapData", JSON.stringify(clean));
    emitMapUpdate({ blueprint: clean, origin: window.clientID });
  }

  function refreshDiagram() {
    // 1) layout
    const allNodes = computeLayout(context.currentMapData, context.currentDetailLevel, config);
    allNodes.forEach(d => {
      if (d.currentX === undefined) { d.currentX = d.x; d.currentY = d.y; }
    });

    // 2) links
    const connectors = gatherConnectors(context.currentMapData, context.currentDetailLevel);
    let linkSel = linkGroup.selectAll("line.link")
      .data(connectors, d => d.source.id + "-" + d.target.id);
    linkSel.exit().remove();
    linkSel = linkSel.enter().append("line")
      .attr("class", "link")
      .merge(linkSel);

    // 3) nodes
    let nodeSel = nodeGroup.selectAll("g.node")
      .data(allNodes, d => d.id);
    nodeSel.exit().remove();

    const enter = nodeSel.enter().append("g")
      .attr("class", d => `node ${d.role}`)
      .attr("transform", d => `translate(${d.currentX},${d.currentY})`);
    enter.append("circle").attr("r", 0);
    enter.append("text")
      .attr("dy", d =>
        d.depth === 0 ? config.mainRadius + 20
      : d.depth === 1 ? config.subRadius + 20
      : config.subSubRadius + 20
      )
      .attr("text-anchor", "middle")
      .text(d => d.title.trim() || config.defaultEmptyText);
    enter.append("rect")
      .attr("class", "editOverlay")
      .style("fill", "transparent")
      .style("pointer-events", "all");

    nodeSel = enter.merge(nodeSel);
    nodeSel.each(function(d) {
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

    // 4) re‑bind events & save blueprint
    bindNodeEvents(nodeGroup, context);
    updateBlueprint();

    // 5) auto‑zoom
    if (!context.manualInteraction) {
      const b = context.computeBounds();
      setTimeout(() => 
        animateZoomToBounds(
          svg, context.zoomBehavior,
          b, 500,
          mapContainer.clientWidth,
          mapContainer.clientHeight
        ),
        20
      );
    }
  }

  // Expose a single “updateDiagram” method on context
  context.updateDiagram = refreshDiagram;

  // Initial render
  refreshDiagram();

  // Re‑render when remote updates arrive
  onMapUpdate(msg => {
    if (msg.origin !== window.clientID) {
      context.reloadDiagram(msg.blueprint);
      context.manualInteraction = false;
    }
  });
}

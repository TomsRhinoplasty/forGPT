// public/js/nodeEvents.js

import * as d3 from "https://unpkg.com/d3?module";
import {
  sproutChildNode,
  dragStarted,
  dragged,
  dragEnded,
  editInlineText
} from "./interactions.js";

/**
 * Binds drag‑and‑drop to every node.
 */
export function bindNodeDrag(nodeGroup, ctx) {
  nodeGroup.selectAll("g.node")
    .call(d3.drag()
      .on("start", function(e, d){ dragStarted.call(this, e, d); })
      .on("drag",   dragged)
      .on("end",    function(e, d){ dragEnded.call(this, e, d, ctx); })
    );
}

/**
 * Binds double‑click on the circle to sprout a child.
 */
export function bindNodeDoubleClick(nodeGroup, ctx) {
  nodeGroup.selectAll("g.node circle")
    .on("dblclick", (e, d) => {
      e.stopPropagation();
      sproutChildNode(d, ctx);
    });
}

/**
 * Binds inline‑text editing to text and overlay rect.
 */
export function bindTextEditing(nodeGroup, ctx) {
  nodeGroup.selectAll("g.node text, g.node rect.editOverlay")
    .style("pointer-events", "all")
    .style("cursor", "text")
    .on("dblclick", (e, d) => {
      e.stopPropagation();
      const txt = d3.select(e.currentTarget.parentNode).select("text").node();
      editInlineText(txt, d, ctx);
    });
}

/**
 * Convenience to wire up *all* node events on one call.
 */
export function bindAllNodeEvents(nodeGroup, ctx) {
  bindNodeDrag(nodeGroup, ctx);
  bindNodeDoubleClick(nodeGroup, ctx);
  bindTextEditing(nodeGroup, ctx);
}

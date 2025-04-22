import * as d3 from "https://unpkg.com/d3?module";
import { config } from "./config.js";

/* ────────────────────────────────────────────────────────────────
   Radius helpers                                                 
───────────────────────────────────────────────────────────────── */
function standardRadius(d) {
  if (d.depth === 0) return config.mainRadius;
  if (d.depth === 1) return config.subRadius;
  if (d.depth === 2) return config.subSubRadius;
  return Math.max(3, config.subSubRadius - (d.depth - 2));
}

function fullRadius(d, currentDetailLevel) {
  if (d.isNew) {
    d.growthProgress = (d.growthProgress || 0) + 0.05;
    if (d.growthProgress >= 1) {
      d.growthProgress = 1;
      d.isNew = false;
    }
    return standardRadius(d) * d.growthProgress;
  }
  if (d.depth <= currentDetailLevel || d.expanding || d.collapsing) {
    return standardRadius(d);
  }
  return 0;
}

/* ────────────────────────────────────────────────────────────────
   Fit‑to‑bounds helper (unchanged)                              
───────────────────────────────────────────────────────────────── */
export function animateZoomToBounds(
  svg,
  zoomBehavior,
  bounds,
  duration = 750,
  availWidth,
  availHeight
) {
  if (!bounds || bounds.width <= 0 || bounds.height <= 0) return;

  const pad = config.zoomPadding;
  const pb = {
    x: bounds.x - pad,
    y: bounds.y - pad,
    width: bounds.width + 2 * pad,
    height: bounds.height + 2 * pad
  };

  const scale = Math.min(availWidth / pb.width, availHeight / pb.height)
    * config.zoomScaleMultiplier;
  const cx = pb.x + pb.width / 2;
  const cy = pb.y + pb.height / 2;
  const tx = availWidth / 2 - scale * cx;
  const ty = availHeight / 2 - scale * cy;

  svg.transition()
     .duration(duration)
     .call(
       zoomBehavior.transform,
       d3.zoomIdentity.translate(tx, ty).scale(scale)
     );
}

/* ────────────────────────────────────────────────────────────────
   Animation loop with idle‑stop                                  
   - Stops after 60 frames where max node movement < 0.1 px       
   - Returns kick() to restart the loop on demand                
───────────────────────────────────────────────────────────────── */
export function startAnimationLoop(context) {
  let running = false;
  let idleFrames = 0;

  function animate(now) {
    context._lastT = context._lastT || now;
    const t = 1 - Math.exp(-5 * (now - context._lastT) / 1000);
    context._lastT = now;

    let maxMove = 0;

    context.allNodes.forEach(n => {
      if (!n.dragging) {
        n.currentX += (n.x - n.currentX) * t;
        n.currentY += (n.y - n.currentY) * t;
        const m = Math.hypot(n.x - n.currentX, n.y - n.currentY);
        if (m > maxMove) maxMove = m;
      }
    });

    context.nodeSel
      .attr("transform", d => `translate(${d.currentX}, ${d.currentY})`)
      .select("circle")
      .attr("r", d => fullRadius(d, context.currentDetailLevel));

    context.nodeSel.select("text")
      .style("opacity", d => (d.depth <= context.currentDetailLevel ? 1 : 0));

    context.linkSel
      .attr("x1", d => d.source.currentX)
      .attr("y1", d => d.source.currentY)
      .attr("x2", d => d.target.currentX)
      .attr("y2", d => d.target.currentY);

    if (maxMove < 0.1) idleFrames++;
    else idleFrames = 0;

    if (idleFrames < 60) {
      requestAnimationFrame(animate);
    } else {
      running = false;
    }
  }

  function kick() {
    // Reset timestamp so the first frame animates gradually
    context._lastT = undefined;
    if (!running) {
      idleFrames = 0;
      running = true;
      requestAnimationFrame(animate);
    }
  }

  kick();
  return kick;
}

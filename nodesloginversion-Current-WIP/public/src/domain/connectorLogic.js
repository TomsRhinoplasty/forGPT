/**
 * Module for node-related functionalities, such as gathering connectors and drawing the legend.
 * @module nodes
 */

/**
 * Gathers connector links between nodes.
 * 1) For each main node (except the last), links its deepest visible nodes to the next main node.
 * 2) Links each node to its children if within the detail level.
 * @param {Array} mainNodes - Array of main nodes.
 * @param {number} detailLevel - The current detail level.
 * @returns {Array} Array of link objects with source and target nodes.
 */
export function gatherConnectors(mainNodes, detailLevel) {
  let links = [];
  for (let i = 0; i < mainNodes.length - 1; i++) {
    const currentMain = mainNodes[i];
    const nextMain = mainNodes[i + 1];
    // Gather the deepest visible nodes in the current main node’s subtree.
    const deepestNodes = gatherDeepestVisibleNodes(currentMain, detailLevel, 0);
    deepestNodes.forEach(v => {
      if (v !== nextMain) {
        links.push({ source: v, target: nextMain });
      }
    });
  }

  // Link each node to its children if they are within the detail level.
  mainNodes.forEach(m => {
    gatherParentChildLinks(m, detailLevel, 0, links);
  });

  return links;
}

/**
 * Recursively gathers the deepest visible nodes in a subtree up to the given detail level.
 * @param {Object} node - The node object.
 * @param {number} detailLevel - The maximum depth to display.
 * @param {number} depth - Current depth.
 * @returns {Array} Array of deepest visible nodes.
 */
function gatherDeepestVisibleNodes(node, detailLevel, depth) {
  if (!node.children || node.children.length === 0 || depth === detailLevel) {
    return [node];
  }
  let results = [];
  node.children.forEach(child => {
    if (depth < detailLevel) {
      results = results.concat(gatherDeepestVisibleNodes(child, detailLevel, depth + 1));
    }
  });
  return results.length > 0 ? results : [node];
}

/**
 * Recursively gathers links between parent and child nodes.
 * @param {Object} node - The node object.
 * @param {number} detailLevel - The current detail level.
 * @param {number} depth - Current depth.
 * @param {Array} links - Array to accumulate the links.
 */
function gatherParentChildLinks(node, detailLevel, depth, links) {
  if (!node.children) return;
  if (depth < detailLevel) {
    node.children.forEach(child => {
      links.push({ source: node, target: child });
      gatherParentChildLinks(child, detailLevel, depth + 1, links);
    });
  }
}

/**
 * Draws a legend on the SVG element to indicate the roles of tasks.
 * @param {Object} svg - The D3 selection of the SVG element.
 */
export function drawLegend(svg) {
  const legend = svg.append("g")
                    .attr("class", "legend")
                    .attr("transform", "translate(20,20)");
  const legendData = [
    { role: "ai", label: "AI-driven Task" },
    { role: "human", label: "Human-required Task" },
    { role: "hybrid", label: "Hybrid Task" }
  ];
  const legendSpacing = 30;
  legendData.forEach((d, i) => {
    legend.append("circle")
          .attr("cx", 10)
          .attr("cy", 10 + i * legendSpacing)
          .attr("r", 8)
          .attr("class", d.role);
    legend.append("text")
          .attr("x", 30)
          .attr("y", 15 + i * legendSpacing)
          .text(d.label);
  });
}

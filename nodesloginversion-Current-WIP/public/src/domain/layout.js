/**
 * Module for layout computations.
 * This module calculates the positions of nodes for the diagram based on the hierarchical
 * data and the current detail level. It exposes a single function, computeLayout(), that
 * resets node positions, computes subtree heights (with caching), and assigns coordinates,
 * then returns a flattened array of nodes.
 */

export function computeLayout(mapData, detailLevel, config) {
  // Reset positions for all nodes.
  mapData.forEach(m => resetPositions(m));

  if (detailLevel === 0) {
    // Fully collapsed state: Place main nodes in a row with a vertical offset.
    let currentX = config.mainStartX;
    const verticalOffset = config.verticalOffsetCollapsed;
    const collapsedSpacing = config.collapsedSpacing;
    mapData.forEach((node, i) => {
      const direction = (i % 2 === 0) ? -1 : 1;
      node.x = currentX;
      node.y = config.centerY + direction * verticalOffset;
      node.subtreeHeight = config.nodeHeight; // Use configurable node height
      collapseChildren(node);
      currentX += collapsedSpacing;
    });
  } else {
    // Expanded state: Compute subtree heights and assign positions recursively.
    let currentX = config.mainStartX;
    mapData.forEach(node => {
      node.x = currentX;
      node.y = config.centerY;
      computeSubtreeHeight(node, detailLevel, 0, config);
      assignPositions(node, node.y, detailLevel, 0, config);
      currentX = getRightmostX(node) + config.mainSpacing;
    });
  }

  // Flatten the hierarchical structure into a single array.
  let flattened = [];
  mapData.forEach(m => gatherAllNodes(m, 0, null, flattened));
  return flattened;
}

// --- Private Helper Functions ---

function resetPositions(node) {
  node.x = 0;
  node.y = 0;
  node.subtreeHeight = 0;
  // Clear cached heights, so next full layout uses fresh data
  if (node._heightCache) delete node._heightCache;
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach(c => resetPositions(c));
  }
}

function collapseChildren(node) {
  if (!node.children || node.children.length === 0) return;
  node.children.forEach(child => {
    child.x = node.x;
    child.y = node.y;
    collapseChildren(child);
  });
}

function computeSubtreeHeight(node, detailLevel, depth = 0, config) {
  const nodeHeight = config.nodeHeight;
  const childCount = node.children ? node.children.length : 0;

  // Initialize cache object
  if (!node._heightCache) node._heightCache = {};
  const cache = node._heightCache;

  // If cached for this detailLevel & same childCount, reuse it
  if (cache.detailLevel === detailLevel && cache.childCount === childCount) {
    node.subtreeHeight = cache.subtreeHeight;
    return cache.subtreeHeight;
  }

  // Compute fresh
  let height;
  if (depth === detailLevel || !node.children || childCount === 0) {
    height = nodeHeight;
  } else {
    const spacing = config.verticalSpacing;
    height = node.children.reduce((sum, child) => {
      return sum + computeSubtreeHeight(child, detailLevel, depth + 1, config);
    }, 0) + spacing * (childCount - 1);
    height = Math.max(nodeHeight, height);
  }

  // Store in cache
  cache.detailLevel    = detailLevel;
  cache.childCount     = childCount;
  cache.subtreeHeight  = height;

  node.subtreeHeight = height;
  return height;
}

function assignPositions(node, centerY, detailLevel, depth = 0, config) {
  node.y = centerY;
  if (!node.children || node.children.length === 0) return;
  if (depth + 1 > detailLevel) {
    node.children.forEach(child => {
      child.x = node.x;
      child.y = node.y;
      assignPositions(child, node.y, detailLevel, depth + 1, config);
    });
    return;
  }
  const spacing = config.verticalSpacing;
  let totalChildrenHeight = node.children.reduce((sum, child) => sum + child.subtreeHeight, 0)
                            + spacing * (node.children.length - 1);
  let startY = centerY - totalChildrenHeight / 2;
  node.children.forEach(child => {
    let childCenterY = startY + child.subtreeHeight / 2;
    child.x = node.x + offsetX(depth + 1, config);
    child.y = childCenterY;
    assignPositions(child, childCenterY, detailLevel, depth + 1, config);
    startY += child.subtreeHeight + spacing;
  });
}

function offsetX(depth, config) {
  // For simplicity, offset child nodes by half of mainSpacing.
  return config.mainSpacing / 2;
}

function getRightmostX(node) {
  let maxX = node.x;
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach(child => {
      let childMax = getRightmostX(child);
      if (childMax > maxX) maxX = childMax;
    });
  }
  return maxX;
}

function gatherAllNodes(node, depth, parent, flattened) {
  node.depth = depth;
  node.parent = parent;
  flattened.push(node);
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach(child => {
      gatherAllNodes(child, depth + 1, node, flattened);
    });
  }
}

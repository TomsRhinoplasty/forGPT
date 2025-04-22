/**
 * Configuration settings for diagram layout, animation, and common constants.
 */
export const config = {
  // General visual constants
  mainStartX: 100,
  mainSpacing: 300,
  centerY: window.innerHeight / 2,
  mainRadius: 50,
  subRadius: 20,
  subSubRadius: 10,
  defaultEmptyText: "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0",
  defaultEmptyWidth: 250,
  defaultEmptyHeight: 30,
  deletionThreshold: 100,

  // Layout constants (moved from layout.js)
  nodeHeight: 40,               // Base node height
  verticalSpacing: 50,          // Vertical spacing between siblings
  verticalOffsetCollapsed: 100, // Vertical offset for main nodes when collapsed
  collapsedSpacing: 275,        // Horizontal spacing between main nodes in collapsed state

  // Animation constants (moved from animation.js)
  zoomPadding: 50,              // Padding for zoom calculations (in pixels)
  zoomScaleMultiplier: 0.9,     // Multiplier applied to computed zoom scale

  // Repulsion simulation constant
  repulsionTicks: 30            // Number of simulation iterations used for repulsion
};

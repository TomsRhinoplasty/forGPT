// src/utils/uid.js
/**
 * Generate a short random ID with optional prefix.
 * Used for new‐node and new‐map IDs.
 */
export function uid(prefix = "m") {
  return prefix + Math.random().toString(36).slice(2, 10);
}

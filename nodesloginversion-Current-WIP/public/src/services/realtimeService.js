// public/js/realtime.js

import { io } from "https://cdn.socket.io/4.6.1/socket.io.esm.min.js";

const socket = io();

// Temporarily stub out .emit to prevent deep binary recursion
socket.emit = (...args) => {
  // no-op for now; real‑time will be re‑enabled on actual user actions
};

socket.on("connect", () => {
  console.log("Real-time: Connected (emit is stubbed).");
});

socket.on("disconnect", () => {
  console.log("Real-time: Disconnected.");
});

/**
 * emitMapUpdate(blueprint, origin)
 * Wrapper around socket.emit for mapUpdate.
 * blueprint: sanitized map data
 * origin: clientID string
 */
export function emitMapUpdate(blueprint, origin) {
  socket.emit("mapUpdate", { blueprint, origin });
}

/**
 * onMapUpdate(callback)
 * Register a handler for incoming mapUpdated events.
 * callback receives the data object from the server.
 */
export function onMapUpdate(callback) {
  socket.on("mapUpdated", data => {
    callback(data);
  });
}

// (Optionally) export the raw socket if you need it elsewhere
export { socket };

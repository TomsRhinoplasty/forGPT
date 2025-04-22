// public/src/controllers/chatController.js

import { showToast } from "../adapters/uiAdapter.js";
import { stripForSave } from "../services/persistService.js";

/**
 * Wires your chat input & send button to the LLM endpoint,
 * streams the response, renders messages, and applies role updates.
 */
export function initChatController(context) {
  const chatLog   = document.getElementById("chatLog");
  const chatInput = document.getElementById("chatInput");
  const chatSend  = document.getElementById("chatSendButton");

  async function sendChat() {
    const question = chatInput.value.trim();
    if (!question) return;

    // 1) Append user message
    const um = document.createElement("div");
    um.className = "chat-message user-message";
    um.textContent = question;
    chatLog.appendChild(um);
    chatLog.scrollTop = chatLog.scrollHeight;
    chatInput.value = "";

    // 2) Prepare bot reply container
    const bm = document.createElement("div");
    bm.className = "chat-message bot-message";
    chatLog.appendChild(bm);

    try {
      // 3) Call the LLM API
      const res = await fetch("/api/llm/query", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          mapData: context.currentMapData.map(stripForSave)
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // 4) Stream in chunks
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false, buffer = "";

      while (!done) {
        const { value, done: d } = await reader.read();
        done = d;
        if (value) {
          buffer += decoder.decode(value);
          bm.textContent = buffer;
          chatLog.scrollTop = chatLog.scrollHeight;
        }
      }

      // 5) Extract and apply role updates JSON
      const marker = "UPDATE_MAP_ROLES:";
      const idx = buffer.lastIndexOf(marker);
      if (idx !== -1) {
        const jsonText = buffer.slice(idx + marker.length).trim();
        try {
          const updates = JSON.parse(jsonText);
          context.applyRoleUpdates(updates);
        } catch (err) {
          console.warn("Failed to parse role-update JSON:", err);
        }
        // Remove the JSON from the visible text
        bm.textContent = buffer.slice(0, idx);
      }
    } catch (err) {
      console.error("Chat error:", err);
      const em = document.createElement("div");
      em.className = "chat-message bot-message";
      em.textContent = `Error: ${err.message}`;
      chatLog.appendChild(em);
      chatLog.scrollTop = chatLog.scrollHeight;
      showToast("Chat error: " + err.message);
    }
  }

  // Wire up the send button and Enter key
  chatSend.onclick = sendChat;
  chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChat();
    }
  });
}

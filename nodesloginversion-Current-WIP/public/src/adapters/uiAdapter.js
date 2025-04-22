// src/adapters/uiAdapter.js

/**
 * Initialize the chat drawer and adjust the map/SVG container so nothing hides under it.
 */
export function initDrawer(mapContainer, svg, context) {
  const button = document.getElementById("chatToggleButton");
  const drawer = document.getElementById("chatDrawer");

  function applyLayout() {
    const open = drawer.classList.contains("open");
    const shift = open ? drawer.offsetWidth : 0;

    // shift the map container over
    mapContainer.style.left  = `${shift}px`;
    mapContainer.style.width = `calc(100% - ${shift}px)`;

    // resize the SVG to fill that container
    svg
      .attr("width",  mapContainer.clientWidth)
      .attr("height", mapContainer.clientHeight);

    // re‑zoom to fit
    context.autoZoom();
  }

  button.addEventListener("click", () => {
    drawer.classList.toggle("open");
    context.manualInteraction = false;
    setTimeout(applyLayout, 350); // wait for CSS slide
  });

  // initial layout
  applyLayout();

  return { applyLayout };
}

/**
 * Show a custom modal dialog.
 * @param title – modal title
 * @param bodyHTML – inner HTML for the body
 * @param cancel – whether to show a Cancel button
 * @returns Promise that resolves to user input or true/false
 */
function customModal({ title, bodyHTML, cancel = true }) {
  return new Promise(res => {
    const modal     = document.getElementById("customModal"),
          titleEl   = document.getElementById("customModalTitle"),
          bodyEl    = document.getElementById("customModalBody"),
          x         = document.getElementById("customModalClose"),
          ok        = document.getElementById("customModalOk"),
          cancelBtn = document.getElementById("customModalCancel");

    titleEl.innerText = title;
    bodyEl.innerHTML  = bodyHTML;
    cancelBtn.style.display = cancel ? "inline-block" : "none";
    modal.classList.remove("hidden");

    const done = v => {
      modal.classList.add("hidden");
      [x, ok, cancelBtn].forEach(b => (b.onclick = null));
      res(v);
    };
    x.onclick         = () => done(cancel ? false : null);
    cancelBtn.onclick = () => done(false);
    ok.onclick        = () => {
      const inp = document.getElementById("customModalInput");
      done(inp ? inp.value.trim() : true);
    };
  });
}

/**
 * Prompt the user for text input.
 * @param t – prompt title
 * @param d – default value
 * @returns Promise<string|null> (null if cancelled)
 */
export const showModalPrompt = (t, d = "") =>
  customModal({
    title: t,
    bodyHTML: `<input id="customModalInput" style="width:100%" value="${d}">`,
    cancel: true
  }).then(v => (v === "" ? null : v));

/** Show a confirmation dialog (OK/Cancel). */
export const showModalConfirm = (t, m) =>
  customModal({ title: t, bodyHTML: `<p>${m}</p>`, cancel: true });

/** Show an informational dialog (OK only). */
export const showModalInfo = (t, m) =>
  customModal({ title: t, bodyHTML: `<p>${m}</p>`, cancel: false });

/**
 * Show a transient toast message at the bottom of the screen.
 * @param message – text to display
 */
export function showToast(message) {
  let toast = document.getElementById("globalToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id        = "globalToast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

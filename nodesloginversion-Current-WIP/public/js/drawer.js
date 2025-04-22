// public/js/drawer.js

/**
 * Manages the chat‑drawer open/close and adjusts the mapContainer
 * and SVG viewport so nothing ever hides underneath.
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

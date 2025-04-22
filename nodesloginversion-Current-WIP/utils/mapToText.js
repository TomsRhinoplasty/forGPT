/**
 * Recursively converts node map data into plain text.
 *
 * Each node is output in the following format:
 * - [node id] Title (role): Description
 *
 * @param {Array} nodes - Array of node objects with properties: id, title, role, desc, and children.
 * @param {number} [indent=0] - The current indentation level.
 * @returns {string} A plain text summary of the node map including node IDs.
 */
function nodeMapToText(nodes, indent = 0) {
  let text = "";
  const spacer = "  ".repeat(indent);
  nodes.forEach(node => {
    text += `${spacer}- [${node.id}] ${node.title} (${node.role}): ${node.desc}\n`;
    if (node.children && node.children.length > 0) {
      text += nodeMapToText(node.children, indent + 1);
    }
  });
  return text;
}

module.exports = { nodeMapToText };

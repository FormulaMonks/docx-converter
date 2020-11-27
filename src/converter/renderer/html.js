function render(element) {
  if (typeof element === "string") {
    return element;
  }
  if (element.type === "document") {
    return element.children.map(render).join("");
  }
  return `<${element.type}${
    element.class ? ` class="${element.class}"` : ""
  }>${element.children.map(render).join("")}${element.content || ""}</${
    element.type
  }>`;
}

module.exports = {
  render,
};

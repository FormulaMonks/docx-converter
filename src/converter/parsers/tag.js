function getTagName(tagName) {
  switch (tagName) {
    case "tbl":
      return "table";
    case "tc":
      return "td";
    case "b":
      return "strong";
    case "bookmarkStart":
    case "instrText":
      return "code";
    default:
      return tagName;
  }
}

function convertToNode(tag) {
  const nodeType = tag.name.replace("w:", "");
  return {
    type: getTagName(nodeType),
    children: [],
  };
}

module.exports = {
  convertToNode,
};

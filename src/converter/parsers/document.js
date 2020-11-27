const Saxophone = require("saxophone");
const { convertToNode } = require("./tag");

const knownTags = [
  "w:document",
  "w:body",
  "w:p",
  "w:tbl",
  "w:tr",
  "w:tc",
  "w:b",
  "w:bookmarkStart",
  "w:instrText",
];

/**
 * Parse a document.xml content and generate a DOM/JSON structure.
 *
 * @param {string} document content.
 * @return {Dom} dom.
 */
function parseDocument(documentContent) {
  return new Promise((res) => {
    const dom = convertToNode({ name: "html" });
    const stack = [dom];
    const parser = new Saxophone();

    parser.on("tagopen", (tag) => {
      // Unkown tags can be ignored (i.e., not added to the dom).
      // But their children might get added, if they are known/useful.
      if (!knownTags.includes(tag.name)) return;

      const newNode = convertToNode(tag);
      const parent = stack[stack.length - 1];
      parent.children.push(newNode);
      stack.push(newNode);
    });

    parser.on("text", (text) => {});

    parser.on("tagclose", (tag) => {
      if (!knownTags.includes(tag.name)) return;
      stack.pop();
    });

    parser.on("finish", () => {
      res(dom);
    });

    parser.parse(documentContent);
  });
}

module.exports = {
  parseDocument,
};

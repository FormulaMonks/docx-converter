const Saxophone = require("saxophone");
const { DomBuilder } = require("./dom-builder");

/**
 * Parses a document.xml content and generates a DOM/JSON structure.
 *
 * @param {string} document content.
 * @return {Dom} dom.
 */
function parseDocument(documentContent) {
  return new Promise((res) => {
    const parser = new Saxophone();
    const domBuilder = new DomBuilder();

    parser.on("tagopen", domBuilder.openTag);
    parser.on("text", domBuilder.appendText);
    parser.on("tagclose", domBuilder.closeTag);
    parser.on("finish", () => res(domBuilder.getDom()));

    parser.parse(documentContent);
  });
}

module.exports = {
  parseDocument,
};

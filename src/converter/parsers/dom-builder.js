const { convertToNode } = require("./tag");

const knownTags = [
  "w:document",
  "w:body",
  "w:p",
  "w:tbl",
  "w:tr",
  "w:tc",
  "w:instrText",
];

class DomBuilder {
  documentRels = null;
  dom = convertToNode({ name: "html" });
  stylesheet = {};
  stack = [this.dom];
  isTextExpected = false;
  levelOnBold = null;
  levelOnMergeField = null;
  levelOnStyleClass = null;
  styleClass = null;

  constructor(documentRels) {
    this.documentRels = documentRels;
    this.openTag = this.openTag.bind(this);
    this.appendText = this.appendText.bind(this);
    this.closeTag = this.closeTag.bind(this);
    this.getDom = this.getDom.bind(this);
  }

  openTag(tag) {
    // triggering, if needed, helper flags
    if (tag.name === "w:t") this.isTextExpected = true;
    if (tag.name === "w:bookmarkStart") this.openBookmark();
    if (tag.name === "w:bookmarkEnd") this.closeBookmark();
    if (tag.name === "w:b") this.levelOnBold = this.stack.length;
    if (tag.name === "w:instrText") this.levelOnMergeField = this.stack.length;
    if (tag.name === "w:pStyle") {
      this.levelOnStyleClass = this.stack.length;
      this.styleClass = this.getAttributeValue(tag, "w:val");
    }

    // Unkown tags can be ignored (i.e., not added to the dom).
    // But their children might get added, if they are known/useful.
    if (!knownTags.includes(tag.name)) return;

    // appending new, expected node to DOM
    this.convertTagAndAppend(tag);
  }

  appendText(text) {
    // ignore if nothing triggered the appendText flag
    if (!this.isTextExpected) return;

    // if bold is in action, add <strong> to stack/dom
    if (this.levelOnBold) this.convertTagAndAppend({ name: "b" });
    if (this.levelOnMergeField) this.convertTagAndAppend({ name: "code" });

    // append the text to this.stack/dom
    this.isTextExpected = false;
    const content = text.contents;
    const parent = this.stack[this.stack.length - 1];
    parent.children.push(content);

    // clean up flags
    if (this.levelOnBold) {
      this.levelOnBold = null;
      this.stack.pop();
    }
    if (this.levelOnMergeField) {
      this.levelOnMergeField = null;
      this.stack.pop();
    }
  }

  closeTag(tag) {
    // reset flags, if needed
    const currentLevel = this.stack.length;
    if (currentLevel < this.levelOnBold) this.levelOnBold = null;
    if (currentLevel < this.levelOnMergeField) this.levelOnMergeField = null;
    if (currentLevel < this.levelOnMergeField) this.levelOnMergeField = null;

    // ignore unkown tags
    if (!knownTags.includes(tag.name)) return;

    // remove node from stack
    this.stack.pop();
  }

  getDom() {
    return this.dom;
  }

  convertTagAndAppend(tag) {
    const newNode = convertToNode(tag);
    const parent = this.stack[this.stack.length - 1];
    parent.children.push(newNode);
    this.stack.push(newNode);
  }

  openBookmark() {
    this.convertTagAndAppend({ name: "code" });
    const parent = this.stack[this.stack.length - 1];
    parent.children.push("[");
    this.stack.pop();
  }

  closeBookmark() {
    this.convertTagAndAppend({ name: "code" });
    const parent = this.stack[this.stack.length - 1];
    parent.children.push("]");
    this.stack.pop();
  }

  getAttributeValue(tag, attributeName) {
    const attributes = tag.attrs.split(" ");
    const attribute = attributes
      .filter((attribute) => attribute.trim() !== "")
      .map((attribute) => {
        const [name, value] = attribute.split("=");
        return { name, value: value?.substring(1, value.length - 1) };
      })
      .find((attribute) => attribute.name === attributeName);
    return attribute?.value;
  }
}

module.exports = {
  DomBuilder,
};

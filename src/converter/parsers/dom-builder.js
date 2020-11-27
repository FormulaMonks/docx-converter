const { convertToNode } = require("./tag");

const knownTags = [
  "w:document",
  "w:body",
  "w:p",
  "w:tbl",
  "w:tr",
  "w:tc",
  "w:bookmarkStart",
  "w:instrText",
];

class DomBuilder {
  dom = convertToNode({ name: "html" });
  stack = [this.dom];
  isTextExpected = false;
  addBoldOnLevel = null;

  constructor() {
    this.openTag = this.openTag.bind(this);
    this.appendText = this.appendText.bind(this);
    this.closeTag = this.closeTag.bind(this);
    this.getDom = this.getDom.bind(this);
  }

  openTag(tag) {
    // triggering, if needed, helper flags
    if (tag.name === "w:t") this.isTextExpected = true;
    if (tag.name === "w:b") this.addBoldOnLevel = this.stack.length;

    // Unkown tags can be ignored (i.e., not added to the dom).
    // But their children might get added, if they are known/useful.
    if (!knownTags.includes(tag.name)) return;

    // appending new, expected node to DOM
    const newNode = convertToNode(tag);
    const parent = this.stack[this.stack.length - 1];
    parent.children.push(newNode);
    this.stack.push(newNode);
  }

  appendText(text) {
    // ignore if nothing triggered the appendText flag
    if (!this.isTextExpected) return;

    // if bold is in action, add <strong> to stack/dom
    if (this.addBoldOnLevel) {
      const newNode = convertToNode({ name: "b" });
      const parent = this.stack[this.stack.length - 1];
      parent.children.push(newNode);
      this.stack.push(newNode);
    }

    // append the text to this.stack/dom
    this.isTextExpected = false;
    const content = text.contents;
    const parent = this.stack[this.stack.length - 1];
    parent.children.push(content);

    // clean up flags
    if (this.addBoldOnLevel) {
      this.addBoldOnLevel = null;
      this.stack.pop();
    }
  }

  closeTag(tag) {
    // reset flags, if needed
    if (this.stack.length < this.addBoldOnLevel) this.addBoldOnLevel = null;

    // ignore unkown tags
    if (!knownTags.includes(tag.name)) return;

    // remove node from stack
    this.stack.pop();
  }

  getDom() {
    return this.dom;
  }
}

module.exports = {
  DomBuilder,
};
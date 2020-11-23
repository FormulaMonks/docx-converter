const fs = require("fs");
const Saxophone = require("saxophone");

const parser = new Saxophone();

const documentFile = __dirname + "/../docx-xml-content/word/document.xml";

const dom = {
  children: [],
};
const counter = 1;
const flatDom = {};
const stack = [dom];
let appendText = false;

const knownNodeTypes = ["document", "body", "p", "tbl", "tr", "tc"];

fs.readFile(documentFile, (err, data) => {
  if (err) throw err;

  parser.on("tagopen", (tag) => {
    const nodeType = tag.name.replace("w:", "");

    if (knownNodeTypes.includes(nodeType)) {
      const newNode = {
        type: nodeType,
        children: [],
      };
      flatDom[`node${counter}`] = newNode;
      const parent = stack[stack.length - 1];
      parent.children.push(newNode);
      stack.push(newNode);
    }

    if (nodeType === "t") {
      appendText = true;
    }
  });

  parser.on("text", (text) => {
    if (appendText) {
      const content = text.contents.trim();
      const parent = stack[stack.length - 1];
      parent.content = (parent.content || "") + content;
      appendText = false;
    }
  });

  parser.on("tagclose", (tag) => {
    const nodeType = tag.name.replace("w:", "");

    if (knownNodeTypes.includes(nodeType)) {
      stack.pop();
    }
  });

  parser.parse(data);
});

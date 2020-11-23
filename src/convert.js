const fs = require("fs");
const Saxophone = require("saxophone");

const parser = new Saxophone();

const documentFile = __dirname + "/../docx-xml-content/word/document.xml";
const htmlFile = __dirname + "/../docx-xml-content/word/document.html";

const dom = {
  children: [],
  type: "html",
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
        type: getTagName(nodeType),
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

    if (nodeType === "pStyle") {
      const attributes = getAttributes(tag);
      const styleType = attributes.find((attr) => attr.name === "w:val");
      if (styleType.value === "Heading1") {
        const parent = stack[stack.length - 1];
        parent.type = "h1";
      }
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

  const htmlContent = convertToHTML(dom);
  console.log(htmlContent);

  fs.writeFile(htmlFile, htmlContent, "UTF-8", (err) => {
    if (err) throw err;
  });
});

function convertToHTML(element) {
  return `<${element.type}>${element.children.map(convertToHTML).join("")}${
    element.content || ""
  }</${element.type}>`;
}

function getTagName(tagName) {
  switch (tagName) {
    case "tbl":
      return "table";
    case "tc":
      return "td";
    default:
      return tagName;
  }
}

function getAttributes(tag) {
  const attributes = tag.attrs.trim().split(" ");
  return attributes.map((attribute) => {
    const [name, value] = attribute.split("=");
    return { name, value: value.substring(1, value.length - 1) };
  });
}

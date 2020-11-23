const fs = require("fs");
const Saxophone = require("saxophone");

const parser = new Saxophone();

const documentFile = __dirname + "/../docx-xml-content/word/document.xml";
const htmlFile = __dirname + "/../converted/document.html";

// the DOM representation
const dom = {
  children: [],
  type: "html",
};

// helper variables
const counter = 1;
const flatDom = {};
const stack = [dom];
let appendText = false;
let bold = false;
const knownNodeTypes = ["document", "body", "p", "tbl", "tr", "tc", "b"];

// parsing and mapping an XML to an HTML file
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

      if (nodeType === "b") bold = true;
    } else if (nodeType === "t") {
      appendText = true;
    } else if (nodeType === "pStyle") {
      const attributes = getAttributes(tag);
      const styleType = attributes.find((attr) => attr.name === "w:val");
      if (styleType.value === "Heading1") {
        const parent = stack[stack.length - 1];
        parent.type = "h1";
        parent.class = styleType.value;
      }
    } else {
      console.log("unkown tag: " + nodeType);
    }
  });

  parser.on("text", (text) => {
    if (appendText) {
      const content = text.contents;
      const parent = stack[stack.length - 1];
      parent.children.push(content);
      appendText = false;

      if (bold) {
        stack.pop();
        bold = false;
      }
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
  if (typeof element === "string") {
    return element;
  }
  if (element.type === "document") {
    return element.children.map(convertToHTML).join("");
  }
  return `<${element.type}${
    element.class ? ` class="${element.class}"` : ""
  }>${element.children.map(convertToHTML).join("")}${element.content || ""}</${
    element.type
  }>`;
}

function getTagName(tagName) {
  switch (tagName) {
    case "tbl":
      return "table";
    case "tc":
      return "td";
    case "b":
      return "strong";
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

const _ = require("lodash");
const fs = require("fs");
const Saxophone = require("saxophone");

const parser = new Saxophone();

const documentFile = __dirname + "/../docx-xml-content/word/styles.xml";
const cssFile = __dirname + "/../converted/styles.css";

const cssClasses = {};
let currentClass = null;

// parsing and mapping an XML to an HTML file
fs.readFile(documentFile, (err, data) => {
  if (err) throw err;

  parser.on("tagopen", (tag) => {
    const attributes = getAttributes(tag);
    if (tag.name === "w:style") {
      const className = attributes.find((attr) => attr.name === "w:styleId");
      cssClasses[className.value] = {};
      currentClass = className.value;
    } else if (currentClass && tag.name === "w:color") {
      const color = attributes.find((attr) => attr.name === "w:val");
      cssClasses[currentClass].color = color.value;
    } else if (currentClass && tag.name === "w:sz") {
      const size = attributes.find((attr) => attr.name === "w:val");
      cssClasses[currentClass]["font-size"] = `${size.value}px`;
    }
  });

  parser.on("text", (text) => {});

  parser.on("tagclose", (tag) => {});

  parser.parse(data);
  console.log(cssClasses);

  const cssContent = convertToCSS(cssClasses);

  fs.writeFile(cssFile, cssContent, "UTF-8", (err) => {
    if (err) throw err;
  });
});

function convertToCSS(element) {
  return Object.getOwnPropertyNames(element)
    .map((property) => {
      if (_.isEmpty(element[property])) {
        return "";
      } else if (typeof element[property] === "object") {
        return `.${property} { ${convertToCSS(element[property])} }`;
      } else {
        return convertPropertyValue(property, element[property]);
      }
    })
    .join("\n\n");
}

function getAttributes(tag) {
  const attributes = tag.attrs.trim().split(" ");
  return attributes.map((attribute) => {
    const [name, value] = attribute.split("=");
    return { name, value: value?.substring(1, value.length - 1) };
  });
}

function convertPropertyValue(property, value) {
  if (property === "color") {
    return `${property}: #${value};`;
  }
  return `${property}: ${value};`;
}

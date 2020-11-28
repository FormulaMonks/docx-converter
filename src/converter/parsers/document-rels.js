const { readFile } = require("fs-extra");
const { DOMParser } = require("xmldom");

async function parse(documentPath) {
  const content = await readFile(documentPath, { encoding: 'UTF-8' });
  return new DOMParser().parseFromString(content);
}

module.exports = {
  parse,
};

const { parseDocument } = require("./parsers/document");
const { extract } = require("./extractor");
const { readFile } = require("./util");

async function convert(docxBuffer, opts) {
  const extractedFiles = await extract(docxBuffer, opts);
  const document = await readFile(extractedFiles.document);
  const dom = await parseDocument(document);
}

module.exports = {
  convert,
};

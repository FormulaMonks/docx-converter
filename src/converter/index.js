const { parseDocument } = require("./parsers/document");
const { extract } = require("./extractor");
const { render } = require("./renderer/html");
const { readFile, writeFile } = require("./util");

async function convert(docxBuffer, opts) {
  const extractedFiles = await extract(docxBuffer, opts);
  const document = await readFile(extractedFiles.document);
  const dom = await parseDocument(document);
  const html = render(dom);
  const path = "/tmp/html-output/";
  await writeFile(path, "index.html", html);
}

module.exports = {
  convert,
};

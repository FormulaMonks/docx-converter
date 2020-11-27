const { ensureDir, readFile, writeFile } = require("fs-extra");
const { parseDocument } = require("./parsers/document");
const { extract } = require("./extractor");
const { render } = require("./renderer/html");
const { a4Appearance } = require("./util");

async function convert(docxBuffer, opts) {
  const extractedFiles = await extract(docxBuffer, opts);
  const document = await readFile(extractedFiles.document);
  const dom = await parseDocument(document);
  const html = render(dom);
  const htmlWithA4Appearance = html.replace(
    "<html>",
    '<html><head><link rel="stylesheet" href="default-styles.css"><link rel="stylesheet" href="styles.css"></head>'
  );
  const outputPath = "/tmp/html-output/";
  await ensureDir(outputPath);
  await writeFile("/tmp/html-output/index.html", htmlWithA4Appearance);
  await writeFile("/tmp/html-output/default-styles.css", a4Appearance());
}

module.exports = {
  convert,
};

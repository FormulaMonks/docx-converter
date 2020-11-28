const unzipper = require("unzipper");
const rmfr = require("rmfr");
const { mkdir } = require("fs");
const { promisify } = require("util");

const makeDir = promisify(mkdir);

async function extract(docxBuffer, opts) {
  // prepare the env to receive the extracted content
  const extractedDocxPath = opts.extractedDocxPath || `/tmp/${Date.now()}/`;
  if (opts.cleanUpExtractedDocxPath) {
    await rmfr(extractedDocxPath);
  }
  await makeDir(extractedDocxPath);

  // extract the docx files
  const zip = await unzipper.Open.buffer(docxBuffer);
  await zip.extract({ path: extractedDocxPath });
  return {
    document: `${extractedDocxPath}/word/document.xml`,
    documentRels: `${extractedDocxPath}/word/_rels/document.xml.rels`,
  };
}

module.exports = {
  extract,
};

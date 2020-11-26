const rmfr = require("rmfr");
const { mkdir } = require("fs");
const { promisify } = require("util");
const { extract } = require("./extractor");

const makeDir = promisify(mkdir);

async function convert(docxBuffer, opts) {
  const extractedDocxPath = opts.extractedDocxPath || `/tmp/${Date.now()}/`;
  if (opts.cleanUpExtractedDocxPath) {
    await rmfr(extractedDocxPath);
  }
  await makeDir(extractedDocxPath);
  await extract(docxBuffer, extractedDocxPath);
}

module.exports = {
  convert,
};

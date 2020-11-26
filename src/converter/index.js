const { extract } = require("./extractor");

async function convert(docxBuffer, opts) {
  await extract(docxBuffer, opts);
}

module.exports = {
  convert,
};

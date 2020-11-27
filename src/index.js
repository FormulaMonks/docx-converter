const { readFile } = require("fs-extra");
const { resolve } = require("path");
const { convert } = require("./converter");

// this will be, eventually, transformed into a express project or similar
async function run() {
  const docxBuffer = await readFile(`${__dirname}/../docx-experiment.docx`);
  const destination = resolve(__dirname, "..", "converted");
  const result = await convert(docxBuffer, {
    extractedDocxPath: destination,
    cleanUpExtractedDocxPath: true,
  });
  console.log(result);
}

run().then(() => {
  console.log("Done");
});

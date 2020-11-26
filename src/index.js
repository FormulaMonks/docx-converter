const { readFile } = require("fs");
const { resolve } = require("path");
const { promisify } = require("util");
const { convert } = require("./converter");

const read = promisify(readFile);

// this will be, eventually, transformed into a express project or similar
async function run() {
  const docxBuffer = await read(`${__dirname}/../docx-experiment.docx`);
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

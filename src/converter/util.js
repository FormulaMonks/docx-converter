const { mkdir, readFile, writeFile } = require("fs");
const rmfr = require('rmfr');
const { promisify } = require("util");

const makeDir = promisify(mkdir);
const read = promisify(readFile);
const write = promisify(writeFile);

async function writeFileWrapper(path, filename, data, options) {
  await rmfr(path);
  await makeDir(path);
  await write(`${path}/${filename}`, data, options);
}

module.exports = {
  readFile: read,
  writeFile: writeFileWrapper,
};

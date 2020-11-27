const { readFile } = require("fs");
const { promisify } = require("util");

const read = promisify(readFile);

module.exports = {
  readFile: read,
};

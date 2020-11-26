const unzipper = require("unzipper");

async function extract(docxBuffer, destination) {
  const zip = await unzipper.Open.buffer(docxBuffer);
  return zip.extract({ path: destination });
}

module.exports = {
  extract,
};

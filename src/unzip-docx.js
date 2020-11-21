const fs = require('fs');
const unzipper = require('unzipper');

fs.createReadStream(`${__dirname}/../docx-experiment.docx`).pipe(
  unzipper.Extract({ path: `${__dirname}/../docx-xml-content/` })
);

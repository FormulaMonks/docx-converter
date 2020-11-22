const fs = require("fs");
const xml2js = require("xml2js");

const parser = new xml2js.Parser({
  preserveChildrenOrder: true,
});

const documentFile = __dirname + "/../docx-xml-content/word/document.xml";

fs.readFile(documentFile, (err, data) => {
  if (err) throw err;

  parser.parseString(data, (err, result) => {
    if (err) throw err;
    fs.writeFile(__dirname + "/output.json", JSON.stringify(result), "utf8", (err) => {
      if (err) throw err;
      console.log("JSON file has been saved.");
    });
  });
});

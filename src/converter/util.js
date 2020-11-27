function a4Appearance() {
  return `
    html {
      display: flex;
      justify-content: center;
      background-color: #aaa;
      padding: 15px 0;
    }
    
    body {
      font-family: Arial, Helvetica, sans-serif;
      width: 8.3in;
      min-height: 11.7in;
      background-color: #fff;
      box-sizing: border-box;
      padding: 1in;
      box-shadow: 3px 3px 6px 2px #444;
    }
    
    code {
      background-color: #dddddd;
      border: 1px solid #bbbbbb;
      border-radius: 3px;
      padding: 0 3px;
    }`;
}

module.exports = {
  a4Appearance,
};

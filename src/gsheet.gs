// Example Google Script code to handle the calls from the bookmarklet

function doGet(e) {
  
  let method = e.parameter.method;

  if(!method)
    return;
  
  console.log(`External call to method '${method}'`);
  
  if(method === "sendDOM") {
    // Take the input data and sort through it. Then insert it into Google Sheets.
    let result = parseInput(e.parameter.scrapeData, e.parameter.from);
    let output = HtmlService.createHtmlOutput(`
        <link rel="stylesheet" href="bootstrap.min.css" crossorigin="anonymous">
        <script src="fontawesome.js" crossorigin="anonymous"></script>
        <div class="bg-light text-center d-flex flex-column justify-content-center" style="height:150px">
          <h2>House Tracker</h2>
          <p class="text-${ result.success ? "success" : "warning" }>
            <i class="fas fa-${ result.success ? "check-circle" : "bomb"}></i>
            ${result.message}
          </p>
        </div>`);
    output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    return output;
  }
}

function parseInput(scrapeData, from) {
  let row = [];
  let output = {
    success: false,
    message: "Could not read data"
  };

  let regexResult = scrapeData.match(/(\d+) bedrooms?/);
  if(regexResult && regexResult.length == 2) {
    row.push(regexResult[1]);
  } else {
    return output;
  }

  // ... fill the rest of the info

  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Sheet 1");

  let Avals = ss.getRange("A1:A").getValues();
  let Alast = Avals.filter(String).length;
  let newRow = Alast + 1;

  sheet.getRange(newRow, 1, 1, row.length).setValues([ row ]);

  output = {
    success: true,
    message: "Added property to spreadsheet"
  }
  return output;
}
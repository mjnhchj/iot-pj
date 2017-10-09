const plotly = require('plotly');
const fs = require('fs');

var trace1 = {
  x: [1, 2, 3, 4],
  y: [149,166,173,174,184,187,223,366,147,174,417,157,393,,147,312,,174,146,142,140,183,228,152,,137,139,150,168,,226228,,381,,377,380,355,316,273341,372,,178141,186368,319,170135,,144,145,143,142,134,149,307,381309,164,140,,330,379208,155,131,345148,335,154,221175215,,146,268,302,,311,143,,133254,137,197159,192,135,300,157,,134,140,176,369,160,353,373,377363,,162,181,332,177138,168356,195,163142137,177134,371,,260135,132128,331,271,138,346126362,131,244],
  type: 'scatter'
};


var data = [trace1, trace2];

plotly.getImage(figure, imgOpts, function (error, imageStream) {
      if (error) {
        reject(`plotly.getImage failed: ${error}`);
      }

      let filePath = __dirname.concat('/public/1.png');

      let fileStream = fs.createWriteStream(filePath);
      imageStream.pipe(fileStream);

    });
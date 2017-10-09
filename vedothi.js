const express = require('express');
const app = express();
const plotly = require('plotly')('tungpt7', 'nMEIrgmKOzhOs7WjNBdw');

const fs = require('fs');

fs.readFile('./demo.txt', 'utf-8', function (err, data) {																			//	  *********
//																																		  *********
renderChart(data);
//																																		  *********
});	

function rand() {
  return Math.random();
}

function renderChart(a) {
  return new Promise((resolve, reject) => {
var b = a.split(',').map(function(item) {
    return parseInt(item, 10);
});
    let trace = {
  y: b,
  type: 'scatter'
};
    let figure = {'data': [trace]};

    let imgOpts = {
      format: 'png',
      width: 1300,
      height: 500
    };
	
plotly.plot('graph', [{
  y: [1,2,3].map(rand()),
  mode: 'lines',

}]);

var cnt = 0;

var interval = setInterval(function() {

  plotly.extendTraces('graph', {
    y: [[1,2,3]]
  }, [0])

  if(cnt === 100) clearInterval(interval);
}, 300);
/*
    plotly.getImage(figure, imgOpts, function (error, imageStream) {
      if (error) {
        reject(`plotly.getImage failed: ${error}`);
      }

      let filePath = __dirname.concat('/public/1.png');

      let fileStream = fs.createWriteStream(filePath);
      imageStream.pipe(fileStream);
      resolve();
    });
*/
  });
}
console.log("rendering ...");


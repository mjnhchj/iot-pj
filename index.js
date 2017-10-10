const PORT = 8080;					

const plotly = require('plotly')('tungpt7', 'nMEIrgmKOzhOs7WjNBdw');
var fs = require('fs');
var http = require('http');
var express = require('express');				
var socketio = require('socket.io')					
var ip = require('ip');
var app = express();									
var server = http.Server(app)
var io = socketio(server);							
var webapp_namesp = io.of('/webapp')				
var esp8266_namesp = io.of('/esp8266')			
var android_namesp = io.of('/android')
var mysql = require('mysql');
var middleware = require('socketio-wildcard')();	
var dateObj = new Date();
var dt = JSON.stringify(dateObj);
var newdat = dt.substring(1, 11);


esp8266_namesp.use(middleware);							
webapp_namesp.use(middleware);							
android_namesp.use(middleware);

server.listen(process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT);
//app.listen(env.OPENSHIFT_NODEJS_PORT, process.env.OPENSHIFT_NODEJS_IP);

console.log("Server running at: " + ip.address() + ":" + PORT)


app.use(express.static("node_modules/mobile-angular-ui")) 			
app.use(express.static("node_modules/angular")) 					
app.use(express.static("node_modules/angular-route")) 				
app.use(express.static("node_modules/socket.io-client")) 			
app.use(express.static("node_modules/angular-socket-io"))		
app.use(express.static("user_interface")) 						

//giải nén chuỗi JSON thành OBJECT
function ParseJson(jsondata) {
    try {
        return JSON.parse(jsondata);
    } catch (error) {
        return null;
    }
}


esp8266_namesp.on('connection', function(socket) {
	console.log('esp8266 connected')
	
	socket.on('disconnect', function() {
		console.log("Disconnected esp8266")
	})
	

	socket.on("*", function(packet) {
		console.log("data ESP8266: ", packet.data)
		var eventName = packet.data[0]
		var eventJson = packet.data[1] || {} 
		webapp_namesp.emit(eventName, eventJson) //gửi toàn bộ lệnh + json đến webapp
		android_namesp.emit(eventName, eventJson) //gửi toàn bộ lệnh + json đến android
	});
	
	socket.on("NHIET_DOAM", function(packet) {
					
	var nh_do = JSON.stringify(packet.nhietdo); //chuyển oject JSON "giatri" thành string 
	var d_am = JSON.stringify(packet.doam); //chuyển oject JSON "giatri" thành string
	
ghi_database(nh_do, d_am); //ghi các giá trị về nhiệt, độ ẩm vào csdl
	});	
})


webapp_namesp.on('connection', function(socket) {
	
	console.log('webapp connected')
	socket.on('disconnect', function() {
		console.log("Disconnected webapp")
	})
	
	socket.on('*', function(packet) {
		console.log("DATA WEBAPP: ", packet.data)
		var eventName = packet.data[0]
		var eventJson = packet.data[1] || {}
		esp8266_namesp.emit(eventName, eventJson) //gửi toàn bộ lệnh + json đến esp8266
		android_namesp.emit(eventName, eventJson) //gửi toàn bộ lệnh + json đến android
	});
})

android_namesp.on('connection', function(socket) {
	
	console.log('android device connected')
	
	socket.on('disconnect', function() {
		console.log("Disconnected android device")
	})
	
	socket.on('*', function(packet) {
		console.log("DATA ANDROID: ", packet.data) 
		var eventName = packet.data[0]
		var eventJson = packet.data[1] || {}
		esp8266_namesp.emit(eventName, eventJson) //gửi toàn bộ lệnh + json đến esp8266
		webapp_namesp.emit(eventName, eventJson) //gửi toàn bộ lệnh + json đến webapp
	});
})
//Function ghi du lieu vao MySQL

function ghi_database (a, b)
{
	var con = mysql.createConnection({
  host: "stevie.heliohost.org",
  user: "mjnhchj_iot",
  password: "iot123456",
  database: "mjnhchj_cosodulieu"
});
con.connect(function(err) {
  if (err) throw err;
  
var sql = "INSERT INTO dulieu (nhietdo, doam, date) VALUES (" + a + ", " + b + ", " + dt + ")";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result.insertId + " record inserted | date " + newdat);
  });
con.end();
});
}

/**********************************************************************************************************************
function renderChart(a) {

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
      width: 1000,
      height: 300
    };

    plotly.getImage(figure, imgOpts, function (error, imageStream) {

      let filePath = __dirname.concat('/webapp/1.png');

      let fileStream = fs.createWriteStream(filePath);
      imageStream.pipe(fileStream);
    });
console.log("rendering ...");

}
*/


console.log("Your script is ok!")

var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sql12189886"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Mysql ghi_database Connected!");
  
var sql = "CREATE TABLE dulieu (id INT AUTO_INCREMENT PRIMARY KEY, nhietdo VARCHAR(255), doam VARCHAR(255), date DATE)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
con.end();
});

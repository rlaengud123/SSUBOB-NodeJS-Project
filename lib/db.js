var mysql = require('mysql');
var db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'dngkgk11',
    database:'ssubob'
});
db.connect();

module.exports = db;
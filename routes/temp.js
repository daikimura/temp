var express = require('express');
var mysql = require('mysql');
var config = require('config');
var connection = mysql.createPool(config.db);

var router = express.Router();
var moment = require('moment-timezone');

var formatDate = function (date, format) {
  if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  if (format.match(/S/g)) {
    var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
    var length = format.match(/S/g).length;
    for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
  }
  return format;
};

/* GET tepm listing. */
router.get('/', function(req, res, next) {
  var dt = new Date();
  dt.setDate(dt.getDate() - 7);
  connection.query("SELECT * FROM data WHERE registered_at >= '" + formatDate(dt, "YYYY-MM-DD hh:mm:ss") + "' ORDER BY registered_at DESC", function (err, rows) {
    res.contentType('application/json');
    if(!err && rows.length > 0) {
      var data = [];
      for(var i = 0; i < rows.length; i++) {
        data.push({
          temp: rows[i].temp / 100.0,
          pressure: rows[i].pressure / 10000.0,
          hum: rows[i].hum / 100.0,
          registered_at: moment(rows[i].registered_at).tz("Asia/Tokyo").format()
        });
      }
      res.send("temp(" + JSON.stringify(data) + ");");
    } else {
      res.send('{"status":"error"}');
    }
  });
});

router.post('/', function(req, res, next) {
  var hw_id = req.body.hw_id;
  var temp = req.body.temp;
  var pressure = req.body.pressure;
  var hum = req.body.hum;
  connection.query('INSERT INTO data (hw_id, temp, pressure, hum, registered_at) VALUE (?, ?, ?, ?, NOW())', [hw_id, temp, pressure, hum], function (err, info) {
    res.contentType('application/json');
    if(!err) {
      res.send('{"status":"ok"}');
    } else {
      res.send('{"status":"error"}');
    }
  });
});

module.exports = router;

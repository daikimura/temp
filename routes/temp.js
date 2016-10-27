var express = require('express');
var mysql = require('mysql');
var config = require('config');
var connection = mysql.createPool(config.db);

var router = express.Router();
var moment = require('moment-timezone');

/* GET tepm listing. */
router.get('/', function(req, res, next) {
  var days = 1;
  if(req.query.day > 1) {
    days = req.query.day;
  }
  var page = 1;
  if(req.query.page > 1) {
    page = req.query.page;
  }
  var from_dt = new Date();
  from_dt.setDate(from_dt.getDate() - (days * page));
  var to_dt = new Date();
  to_dt.setDate(to_dt.getDate() - (days * (page - 1)));

  console.log(moment(from_dt).tz("UTC").format());
  console.log(moment(to_dt).tz("UTC").format());

  connection.query("SELECT * FROM data WHERE registered_at > ? AND registered_at <= ? ORDER BY registered_at DESC", [moment(from_dt).tz("UTC").format(), moment(to_dt).tz("UTC").format()], function (err, rows) {
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

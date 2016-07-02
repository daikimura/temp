var express = require('express');
var mysql = require('mysql');
var config = require('config');
var connection = mysql.createPool(config.db);

var router = express.Router();
var moment = require('moment-timezone');

/* GET tepm listing. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM data ORDER BY registered_at DESC LIMIT 10', function (err, rows) {
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
      res.send(JSON.stringify(data));
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

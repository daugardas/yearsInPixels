var express = require('express');
var router = express.Router();
var mysql = require('mysql');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('monthly', { title: 'Monthly' });
});

router.get(`/:user/:year/:month`, (req, res, next) => {
  let answer = {
    user: req.params.user,
    year: req.params.year,
    month: req.params.month,
    days: {
      '2018-01-01': 0,
      '2018-01-02': 0,
      '2018-01-03': 2,
      '2018-01-04': 2,
      '2018-01-05': 1,
      '2018-01-06': 1,
      '2018-01-23': 5,
    },
  };

  res.setHeader('Content-Type', `application/json`);
  res.send(JSON.stringify(answer));
});

module.exports = router;

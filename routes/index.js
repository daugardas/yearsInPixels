var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
   if(req.session.userId){
    User.findById(req.session.userId)
    .exec((err, user)=>{
      if(err) return next(err);

      return res.render('index', { title: 'Years in pixels', userName: user.username });
    });
  } else {
    res.render('index', { title: 'Years in pixels'});
  }
  
});

module.exports = router;

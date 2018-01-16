var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mid = require('../middleware');

/* GET home page. */
router.get('/',mid.loggedIn,function(req, res, next) {
  User.findById(req.session.userId)
    .exec((err, user)=>{
      if(err) return next(err);

      return res.render('yearly', { title: 'Yearly', userName: user.username});
    });
  
});

module.exports = router;

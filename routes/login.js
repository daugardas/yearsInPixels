var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/user');
var mid = require('../middleware');
/* GET login page. */
/* router.get('/', mid.loggedOut,function(req, res, next) {
  res.render('login', { title: 'Login page' });
}); */

router.post(`/`, (req,res, next)=>{
    if(req.body.username && req.body.password){
        User.authenticate(req.body.username, req.body.password, (error, user)=>{
          if(error || !user){
            var err = new Error('Wrong email or password');
            err.status = 401;
            return next(err);
          } else {
            req.session.userId = user._id;
            res.redirect('/');
          }
        });
    } else {
        var err = new Error('All fields required');
        err.status = 400;
        return next(err);
    }
});

module.exports = router;

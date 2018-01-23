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
      req.body.username = req.body.username.toLowerCase();
        User.authenticate(req.body.username, req.body.password, (error, user)=>{
          if(error || !user){
            let err;
            if(!(error === undefined) && error.message === `User not found`){
              err = new Error('User not found');
              err.status = 401;
            } else {
              err = new Error('Wrong password');
              err.status = 401;
            }
            return next(err);
          } else {
            req.session.userId = user._id;
            res.redirect('/');
          }
        });
    } else {
        let err = new Error('All fields required');
        err.status = 400;
        return next(err);
    }
});
// login had an error, so rerender the login form with errors
router.use(function(err, req, res, next) {
  if(err.message === `User not found`){
    return res.render('index', {userErr: err.message})
  } else if (err.message === `Wrong password`){
    return res.render('index', {passErr: err.message})
  } else if (err.message === `All fields required`){
    return res.render('index', {logFieldsErr: err.message});
  }
  return next(err);
});

module.exports = router;

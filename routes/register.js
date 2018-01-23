var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/user');
var Emotion = require('../models/emotion');
var mid = require('../middleware');
/* GET register page. */
router.get('/', mid.loggedOut,function(req, res, next) {
  res.render('register', { title: 'Register page' });
});

router.post(`/`, (req,res, next)=>{
    if(req.body.email && req.body.username && req.body.password && req.body.passwordConf){

        if(req.body.password !== req.body.passwordConf){
            var err = new Error('Passwords do not match');
            err.status = 400;
            return next(err);
        };
        req.body.username = req.body.username.toLowerCase();
        let userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        };

        // Use schema.create to insert data into the db
        User.create(userData, (err, user)=>{
            if(err){
                return next(err);
            }
            req.session.userId = user._id;
            Emotion.create({username: req.body.username},(err, emotion)=>{
              if(err) return next(err);
            });
            return res.redirect(`/`);
        });

        
    } else {
        let err = new Error('All fields required');
        err.status = 400;
        return next(err);
    }
});

router.use((err,req,res,next)=>{
    // username or email already exists
    if(err.code === 11000){
      
      let field = err.message.split('.$')[1];
      // now we have `<username || email>_1 dup key`
      field = field.split(' dup key')[0];
      field = field.substring(0, field.lastIndexOf('_')); // returns username || email
      console.log(field);
      if(field === `username`){
        return res.render('index', {regUserErr: "Username already exists"});
      }else if (field === 'email'){
        return res.render('index', {regEmailErr: "There is already an user with this email"});
      }
    }else if(err.message === `All fields required`){
      return res.render('index', {regFieldsErr: err.message});
    } else if(err.message === `Passwords do not match`){
      return res.render('index', {regPassMatchErr: err.message});
    }
    return next(err);
});

module.exports = router;

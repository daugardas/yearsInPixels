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
            var err = new Error('Passwords do not match.');
            err.status = 400;
            return next(err);
        };

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
            return res.redirect(`/`);
        });

        Emotion.create({username: req.body.username},(err, emotion)=>{
            if(err) return next(err);
        });
    } else {
        var err = new Error('All fields required');
        err.status = 400;
        return next(err);
    }
});

module.exports = router;

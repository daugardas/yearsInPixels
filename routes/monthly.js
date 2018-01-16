var express = require('express');
var router = express.Router();
var Emotion = require('../models/emotion');
var User = require('../models/user');
var mid = require('../middleware/index');
var bodyParser = require('body-parser');
/* GET home page. */
router.get('/',mid.loggedIn,function(req, res, next) {
  User.findById(req.session.userId)
    .exec((err, user)=>{
      if(err) return next(err);

      return res.render('monthly', { title: 'Monthly', userName: user.username});
    });
  
});

router.get(`/days`,mid.loggedIn,(req, res, next) => {
  let answer = [];

  User.findById(req.session.userId)
    .exec((err, user)=>{
      if(err) return next(err);

      Emotion.findOne({username: user.username}, (err, result)=>{
        if(err) return next(err);
        if(result){
          for (let i = 0; i < result.emotions.length; i++) {
            answer.push([`${result.emotions[i].emotion.emotionDate}`, result.emotions[i].emotion.emotionValue]);
          }
          res.send(answer);
        }
      });
  });

});

router.post('/currentDay',mid.loggedIn, (req, res, next)=>{
  const day = {
    emotion: {
      emotionDate: req.body.date,
      emotionValue: req.body.emotion,
    }
  };
  User.findById(req.session.userId)
    .exec((err, user)=>{
      if(err) return next(err);

      Emotion.findOne({username: user.username,'emotions.emotion.emotionDate': req.body.date}, (err, result)=>{
        if(err) return next(err);
        if(result){
          for (let i = 0; i < result.emotions.length; i++) {
            if(result.emotions[i].emotion.emotionDate === req.body.date){
              result.emotions[i].emotion.emotionValue = req.body.emotion;
              result.save();
            }
          }
        } else{
          Emotion.findOneAndUpdate({username: user.username},{ $push: {emotions: day } },(err, results)=>{
            if(err) return next(err);
          });
        }
      });

    });
  

  res.redirect('/monthly');
});

module.exports = router;

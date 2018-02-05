
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
            //percentages
            let percentages = [];
            for (let j = 0; j < result.emotions[i].emotion.emotionValue.length; j++) {
              const element = result.emotions[i].emotion.emotionValue[j];
              percentages.push([element.mood, element.moodPercentage]);
            }
            answer.push([`${result.emotions[i].emotion.emotionDate}`, percentages, result.emotions[i].id]);
          }
          res.send(answer);
        }
        //answer format = [`YYYY-MM-DD`, [ [moodVal, percentage] ]]
      });
  });
  

});

router.post('/currentDay',mid.loggedIn, (req, res, next)=>{
  let emotions = [];
  let emotionID = req.body.hiddenDbID;
  for(let i = 0; i < 3; i++){
    if(req.body[`emotion${i}`] !== undefined){
      emotions.push( { mood: +req.body[`emotion${i}`], moodPercentage: +req.body[`mood${i}-slider`] } );
    }
  }
  const day = {
    emotion: {
      emotionDate: req.body.date,
      emotionValue: emotions,
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
              result.emotions[i].emotion.emotionValue = emotions;
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

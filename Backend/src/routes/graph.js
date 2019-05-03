var express = require('express');
var router = express.Router();
var kafka = require('../routes/kafka/client');
var answerview =require('../models/AnswerViewSchema');

// Set up middleware
var passport = require('passport');
var requireAuth = passport.authenticate('jwt', {session: false});

router.route('/graphupvote').post( function (req, res) {


  kafka.make_request('answer',{"path":"graphupvote", "body": req.body}, function(error,result){
    if (error) {
      console.log(error);
      console.log("Question not found");
      res.status(400).json({responseMessage: 'Question not found'});
    } else {
      console.log(result.answer);
      
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result.answer));
    }
  })
});

router.route('/graphdownvote').post( function (req, res) {


  kafka.make_request('answer',{"path":"graphdownvote", "body": req.body}, function(error,result){
    if (error) {
      console.log(error);
      console.log("Question not found");
      res.status(400).json({responseMessage: 'Question not found'});
    } else {
      console.log("Question Found");
      console.log(result.answer)
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result.answer));
    }
  })
});
router.route('/graphanswerviews').post( function (req, res) {
  answerview.Answerviews.find({owner_username:req.body.owner_username},{"_id":1,"count":1}).sort(
  { 
      "downvote_count" : -1.0, 
      "upvote_count" : 1.0
  }
).limit(10).exec(function(err, items){
  console.log(items)
  res.writeHead(200, {'content-type':'application/json'});
  res.end(JSON.stringify(items));
  });
 
});


router.route('/updateanswerview').post( function (req, res) {
          answerview.Answerviews.update( {"id":req.body.id},{ $inc: { "count": 1 } , $set:{"answer":req.body.answer,"owner_username":req.body.owner_username},$push:{"peopleviewed":req.body.personviewed}}, { upsert : true }, function (error,result) {
    if (error) {
        console.log(error.message)
 
    } else {
      
      console.log(result)
    }
})

});
module.exports = router;
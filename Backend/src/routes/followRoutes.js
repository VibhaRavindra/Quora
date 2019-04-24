var express = require('express');
var router = express.Router();
var kafka = require('../routes/kafka/client');


// Set up middleware
var passport = require('passport');
var requireAuth = passport.authenticate('jwt', {session: false});


router.route('/question/followquestion').post( function (req, res) {

  console.log("In Follow Question Route");
  console.log(req.body);
  //follower_username
  //qid

  kafka.make_request('follow_topics',{"path":"followquestion", "body": req.body}, function(error,result){
    if (error) {
      console.log(error);
      console.log("Question not found");
      res.status(400).json({responseMessage: 'Question not found'});
    } else {
      console.log("Question Found");
      
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result.result));
    }
  })
});
router.route('/question/followtopic').post( function (req, res) {

  console.log("In Follow Topic Route");
  console.log(req.body);
  //username
  //topicname

  kafka.make_request('follow_topics',{"path":"followtopic", "body": req.body}, function(error,result){
    if (error) {
      console.log(error);
      console.log("Question not found");
      res.status(400).json({responseMessage: 'Question not found'});
    } else {
      console.log("Question Found");
      
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result.result));
    }
  })
});
router.route('/notifications').post( function (req, res) {

  console.log("In Follow Question Route");
  console.log(req.body);
  //follower_username
  //qid

  kafka.make_request('follow_topics',{"path":"getnotifications", "body": req.body}, function(error,result){
    if (error) {
      console.log(error);
      console.log("Question not found");
      res.status(400).json({responseMessage: 'Question not found'});
    } else {
      console.log("Question Found");
      
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result.result));
    }
  })
});

module.exports = router;
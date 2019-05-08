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
    console.log(req.body.qid)
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
router.route('/followtopic').post( function (req, res) {

  console.log("In Follow Topic Route");
  console.log(req.body);
  //user_name
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
router.route('/followuser').post( function (req, res) {

  console.log("In Follow Topic Route");
  console.log(req.body);
  //user_name
  //follow_user_name

  kafka.make_request('follow_topics',{"path":"followuser", "body": req.body}, function(error,result){
    if (error) {
      console.log(error);
      console.log("User not found");
      res.status(400).json({responseMessage: 'Question not found'});
    } else {
      console.log("User Found");
      
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result.result));
    }
  })
});
router.route('/notifications').get( function (req, res) {

  console.log("In Follow Question Route");
  console.log(req.query);
  //follower_username
  //qid

  kafka.make_request('follow_topics',{"path":"getnotifications", "body": req.query}, function(error,result){
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


router.route('/getusersquestions').post( function (req, res) {

  console.log("In Follow Question Route");
  console.log(req.body);
  //user_name

  kafka.make_request('follow_topics',{"path":"getusersquestions", "body": req.body}, function(error,result){
    if (error) {
      console.log(error);
      console.log("Question not found");
      res.status(400).json({responseMessage: 'Question not found'});
    } else {
      console.log(result.result);
      
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result.result));
    }
  })
});
router.route('/unfollowuser').post( function (req, res) {

  console.log("In Follow Topic Route");
  console.log(req.body);
  //user_name
  //unfollow_user_name

  kafka.make_request('follow_topics',{"path":"unfollowuser", "body": req.body}, function(error,result){
    if (error) {
      console.log(error);
      console.log("User not found");
      res.status(400).json({responseMessage: 'Question not found'});
    } else {
      console.log("User Found");
      
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result.result));
    }
  })
});

router.route('/question/unfollowquestion').post( function (req, res) {

  console.log("In Follow Question Route");
  console.log(req.body);
  //follower_username
  //qid

  kafka.make_request('follow_topics',{"path":"unfollowquestion", "body": req.body}, function(error,result){
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
router.route('/unfollowtopic').post( function (req, res) {

  console.log("In Follow Topic Route");
  console.log(req.body);
  //username
  //topicname

  kafka.make_request('follow_topics',{"path":"unfollowtopic", "body": req.body}, function(error,result){
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
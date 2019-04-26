//imports
const express = require('express');
const router = express.Router();
var kafka = require('../routes/kafka/client');

// Set up middleware
var passport = require('passport');
var requireAuth = passport.authenticate('jwt', {session: false});

router.route('/question').post(function (req, res) {
    console.log("Inside question post request");
    console.log("Request Body:");
    console.log(req.body);
    kafka.make_request('question_topics',{"path":"new_question", "body": req.body}, function(err,result){
      if (err) {
        console.log(err);
        res.status(500).json({ responseMessage: 'Database not responding' });
      }
      else if (result.status === 200)
      {
        console.log("Question Added");
        res.status(200).json({ responseMessage: 'Successfully Added!' });
      } else if (result.status === 401){
        console.log("Question already exists");
        res.status(200).json({ responseMessage: 'Question Already exists! Please search for it to find answers' });
      }
    });
  });

  router.route('/questions').get(function (req, res) {
    console.log("Inside questions get request");
    console.log("Request Params:");
    console.log(req.params);
    kafka.make_request('question_topics',{"path":"get_all_questions"}, function(err,result){
      if (err) {
        console.log(err);
        res.status(500).json({ responseMessage: 'Database not responding' });
      }
      else if (result.status === 200)
      {
        console.log("Results found");
        for(var i=0;i<result.questions.length;i++){
          if(result.questions[i].answers.length>0){
          let ansArray = result.questions[i].answers;
          ansArray.sort(function (a, b) {
            if (a.upvote_count == b.upvote_count) {
              return a.timestamp - b.timestamp
            }
            return a.upvote_count - b.upvote_count
          });
          var maxUpvotesAnswer = ansArray[ansArray.length-1];
         // console.log("Max upvotes answer:");
         // console.log(maxUpvotesAnswer);
          let maxAnsObj = [];
          maxAnsObj.push(maxUpvotesAnswer);
          result.questions[i].answers = maxAnsObj;
          console.log(result.questions[i]);
        }
      }
        res.status(200).json({ questions : result.questions });
      } else if (result.status === 204){
        console.log("No results found");
        res.status(200).json({ responseMessage: 'No results found' });
      }
    });
  });

  router.route('/questions/topic').get(function (req, res) {
    console.log("Inside questions for a topic get request");
    console.log("Request Params:");
    console.log(req.query);
    kafka.make_request('question_topics',{"path":"get_topic_questions", "body": req.query}, function(err,result){
      if (err) {
        console.log(err);
        res.status(500).json({ responseMessage: 'Database not responding' });
      }
      else if (result.status === 200)
      {
        console.log("Results found");
        for(var i=0;i<result.questions.length;i++){
          if(result.questions[i].answers.length>0){
          let ansArray = result.questions[i].answers;
          ansArray.sort(function (a, b) {
            if (a.upvote_count == b.upvote_count) {
              return a.timestamp - b.timestamp
            }
            return a.upvote_count - b.upvote_count
          });
          var maxUpvotesAnswer = ansArray[ansArray.length-1];
         // console.log("Max upvotes answer:");
         // console.log(maxUpvotesAnswer);
          let maxAnsObj = [];
          maxAnsObj.push(maxUpvotesAnswer);
          result.questions[i].answers = maxAnsObj;
          console.log(result.questions[i]);
        }
      }
        res.status(200).json({ questions : result.questions });
      } else if (result.status === 204){
        console.log("No results found");
        res.status(200).json({ responseMessage: 'No results found' });
      }
    });
  });

  module.exports = router;
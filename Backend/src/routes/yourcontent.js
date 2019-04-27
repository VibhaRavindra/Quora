var express = require('express');
var router = express.Router();
var kafka = require('../routes/kafka/client');
const User = require('../models/UserSchema');

//route GET routes/answers

router.route('/yourcontent').get(function (req, res) {
    console.log("Inside question post request");
    console.log("Request Body:");
    console.log(req.body);
    kafka.make_request('question_topics',{"path":"get_all_questions", "body": req.body}, function(err,result){
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
      
    

  module.exports = router
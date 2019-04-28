var express = require('express');
var router = express.Router();
var kafka = require('../routes/kafka/client');



//route GET routes/answers

router.route('/getquestionsasked').get( function (req, res) {

    console.log("In get questions asked");
    console.log(req.query);
    //user_name
  
    kafka.make_request('yourcontent',{"path":"getquestionsasked", "body": req.query}, function(error,result){
      if (error) {
        console.log(error);
        console.log("Question not found");
        res.status(400).json({responseMessage: 'Question not found'});
      } else {
        console.log(result.questions);
        
        res.writeHead(200, {'content-type':'application/json'});
        res.end(JSON.stringify(result.questions));
      }
    })
  });
  router.route('/getquestionsfollowed').get( function (req, res) {

    console.log("In get questions followed");
    console.log(req.query);
    //user_name
  
    kafka.make_request('yourcontent',{"path":"getquestionsfollowed", "body": req.query}, function(error,result){
      if (error) {
        console.log(error);
        console.log("Questions followed not found");
        res.status(400).json({responseMessage: 'Question not found'});
      } else {
        console.log(result.questions);
        
        res.writeHead(200, {'content-type':'application/json'});
        res.end(JSON.stringify(result.questions));
      }
    })
  });

  router.route('/getuseranswers').get( function (req, res) {

    console.log("In get user answers");
    console.log(req.query);
    //follower_username
    //qid
  
    kafka.make_request('yourcontent',{"path":"getuseranswers", "body": req.query}, function(error,result){
      if (error) {
        console.log(error);
        console.log("Question not found");
        res.status(400).json({responseMessage: 'Answers not found'});
      } else {
        console.log("Answers Found");
        console.log(result.answers);
        res.writeHead(200, {'content-type':'application/json'});
        res.end(JSON.stringify(result.answers));
      }
    })
  });
      
    

  module.exports = router
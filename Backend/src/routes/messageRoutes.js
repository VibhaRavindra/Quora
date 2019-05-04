//imports
var express = require('express');
var router = express.Router();
var kafka = require('../routes/kafka/client');

// Set up middleware
var passport = require('passport');
var requireAuth = passport.authenticate('jwt', {session: false});

router.get('/emailList', function (req, res) {
    console.log("Inside message emailList get request");
  
    kafka.make_request('message_topics',{"path":"message_emailList"}, function(err,result){
      if (err) {
        console.log(err);
        res.status(500).json({ responseMessage: 'Database not responding' });
      }
      else if (result.status === 200)
      {
        console.log("Results found");
        res.status(200).json({ emailList: result.emailList });
      } else if (result.status === 401){
        console.log("No results found");
        res.status(200).json({ responseMessage: 'No results found!' });
      }
    });
  
  });

  router.post('/new/message', function (req, res) {
    console.log("Inside signup post request");
    console.log("Request Body:");
    console.log(req.body);
  
    kafka.make_request('message_topics',{"path":"save_new_message","body":req.body}, function(err,result){
      if (err) {
        console.log(err);
        res.status(500).json({ responseMessage: 'Database not responding' });
      }
      else if (result.status === 200)
      {
        console.log("Message Added");
        res.status(200).json({ responseMessage: 'Successfully Sent!' });
      }
    });
  
  });


  router.get('/messages/conversationList', function (req, res) {
    console.log("Inside  get conversation request");
    console.log(req.query);
  
    kafka.make_request('message_topics',{"path":"message_conversationList","body":req.query}, function(err,result){
      if (err) {
        console.log(err);
        res.status(500).json({ responseMessage: 'Database not responding' });
      }
      else if (result.status === 200)
      {
        console.log("Results found");
        res.status(200).json({ messageList: result.messageList });
      } else if (result.status === 401){
        console.log("No results found");
        res.status(200).json({ responseMessage: 'No results found!' });
      }
    });
  });

    router.get('/messages', function (req, res) {
      console.log("Inside  get conversation request");
      console.log(req.query);
    
      kafka.make_request('message_topics',{"path":"message_messageList","body":req.query}, function(err,result){
        if (err) {
          console.log(err);
          res.status(500).json({ responseMessage: 'Database not responding' });
        }
        else if (result.status === 200)
        {
          console.log("Results found");
          res.status(200).json({ messages: result.messageList });
        } else if (result.status === 401){
          console.log("No results found");
          res.status(200).json({ responseMessage: 'No results found!' });
        }
      });
    });


module.exports = router;




var express = require('express');
var router = express.Router();
var kafka = require('./kafka/client');
const multer = require('multer');
const FormData = multer();

// Set up middleware
var jwt = require('jsonwebtoken');
var passport = require('passport');
// Set up middleware
var requireAuth = passport.authenticate('jwt', {session: false});

router.get('/getanswer/:question_id/:answerId', (req, res) => {
    console.log("Inside Quora Backend: Get One Answer");
    kafka.make_request('yourcontent', {
        "path": "getanswer", "req": {
            "body": req.body,
            "params": req.params,
            "query": req.query
        }
    }, function (err, result) {
        if (err) {
            console.log(err);
            console.log("Answer not found");
            res.status(400).json({ responseMessage: 'Answer not found' });
        } else {
            console.log("Answer Details:" + JSON.stringify(result));

            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(result));
        }
    })
})

router.get('/questions_asked', (req,res,next) => {
    let body = {
        userid: req.query.userid
    }
    kafka.make_request('yourcontent', {"path":"questions_asked", body}, function(err,result){
        if (err){
            res.status(400).send({
                questionsAskedSuccess: false,
                questions_asked_array: []
            })
        }else{
            res.status(200).send(result);
        }
    });
});

router.get('/questions_followed', (req,res,next) => {
    console.log("Inside Backend YourContent.js")
    let body = {
        userid: req.query.userid
    }
    kafka.make_request('yourcontent', {"path":"questions_followed", body}, function(err,result){
        if (err){
            res.send({
                questionsFollowedSuccess: false,
                questions_followed_array: []
            })
        }else{
            res.send(result);
        }
    });
});

router.get('/questions_answered', (req,res,next) => {
    console.log("Inside Backend YourContent.js questions_answered")
    let body = {
        userid: req.query.userid
    }
    kafka.make_request('yourcontent', {"path":"questions_answered", body}, function(err,result){
        if (err){
            res.send({
                questionsAnsweredSuccess: false,
                questions_answered_array: []
            })
        }else{
            res.send(result);
        }
    });
});

module.exports = router;
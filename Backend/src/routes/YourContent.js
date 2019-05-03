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


router.get('/questions_asked', (req,res,next) => {
    console.log("Inside Backend YourContent.js")
    let body = {
        userid: req.query.userid
    }
    kafka.make_request('yourcontent', {"path":"questions_asked", body}, function(err,result){
        if (err){
            res.send({
                questionsAskedSuccess: false,
                questions_asked_array: []
            })
        }else{
            res.send(result);
        }
    });
});

module.exports = router;
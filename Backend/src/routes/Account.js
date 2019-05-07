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


router.put('/signup', FormData.none(), (req,res,next) => {
    let body = {
      firstname: req.body.firstname, 
      lastname: req.body.lastname, 
      user_name: req.body.user_name,
      password: req.body.password
    }
    console.log("Inside Backend Account.js", body)
    kafka.make_request('account', {"path":"signup", body}, function(err,result){
        if (err){
            res.send({
              signupSuccess:false,
              signupMessage:"Sign Up Failed"
            })
        }else{
            res.send(result);
        }
    });
});

router.post("/deactivate", FormData.none(), (req,res)=>{
    let body = {
        user_name: req.body.user_name, 
        password: req.body.password
    }
    kafka.make_request('account', {"path":"deactivate", "body":body}, function(err,result){
        if (err){
            res.send({
                deactivateSuccess:false
            })
        }else{
            console.log(result)
            res.send(result)
        }
    });
});

router.delete("/delete", FormData.none(), (req,res)=>{
    let body = {
        user_name: req.body.user_name,
        password: req.body.password
    }
    kafka.make_request('account', {"path":"delete", "body":body}, function(err,result){
        if (err){
            res.send({
                deleteSuccess:false
            })
        }else{
            console.log(result)
            res.send(result)
        }
    });
});

router.post('/signin', FormData.none(), (req,res,next) => {
    let body = {
        user_name: req.body.user_name, 
        password: req.body.password
    }
    kafka.make_request('account', {"path":"signin", "body":body}, function(err,result){
        console.log('in result');
        console.log(result);
        if (err){
            res.send({
                signinSuccess:false,
                signinMessage:"Sign In Failed"
            })
        }else{
            var token = {
                signinSuccess : result.signinSuccess,
                user_name:result.user_name,
                firstname: result.firstname,
                lastname: result.lastname,
                userid: result.userid
            }
            var signed_token = jwt.sign(token, "cmpe273", {
                expiresIn: 86400 // in seconds
            });
            result.token = signed_token
            console.log(result);
            res.send(result);
        }
    });
})
router.post('/selectedTopics', (req,res,next) => {
    let body = {
      topics: req.body.topics,
      userid: req.body.userid,
      user_name: req.body.user_name
    }
    console.log("Inside Backend Account.js", body)
    kafka.make_request('account', {"path":"selectedTopics", body}, function(err,result){
        if (err){
            res.send({
                selectTopicsSuccess:false,
                select_topics: false,
                isTopicSelected: false,
                topics: []
            })
        }else{
            res.send(result);
        }
    });
});

module.exports = router;
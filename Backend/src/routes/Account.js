var express = require('express');
var router = express.Router();
var kafka = require('./kafka/client');
const multer = require('multer');
const FormData = multer();

// Set up middleware
var passport = require('passport');
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
                IsLoggedIn : result.isLoggedIn,
                isStudent:result.isStudent,
                userid:result.userid,
                user_name:result.user_name
            }
            var signed_token = jwt.sign(token, "cmpe273", {
                expiresIn: 86400 // in seconds
            });
            result.token = signed_token
            // req.session.IsLoggedIn = result.isLoggedIn;
            // req.session.isStudent = result.isStudent;
            // req.session.userid =  result.userid;
            // req.session.user_name = result.user_name;
            res.send(result);
        }
    });
})

module.exports = router;
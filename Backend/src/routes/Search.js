var express = require('express');
var router = express.Router();
var kafka = require('./kafka/client');
const multer = require('multer');
const FormData = multer();

var jwt = require('jsonwebtoken');
var passport = require('passport');
var requireAuth = passport.authenticate('jwt', {session: false});

router.get('/topics/:searchText',requireAuth, (req,res,next) => {
    let body = {
        searchText: req.params.searchText
    }
    console.log("Inside Backend Search.js", req.params.searchText)
    kafka.make_request('search', {"path":"topics", body}, function(err,result){
        if (err){
            res.send({
                searchSuccess: false,
                topics_array: []
            })
        }else{
            res.send(result);
        }
    });
});

router.get('/profiles/:searchText',requireAuth, FormData.none(), (req,res,next) => {
    let body = {
        searchText: req.params.searchText
    }
    kafka.make_request('search', {"path":"profiles", body}, function(err,result){
        console.log('in result');
        console.log(result);
        if (err){
            res.send({
                searchSuccess: false,
                profiles_array: []
            })
        }else{
            res.send(result);
        }
    });
})
router.get('/questions/:searchText',requireAuth, (req,res,next) => {
    let body = {
        searchText: req.params.searchText
    }
    console.log("Inside Backend Account.js", body)
    kafka.make_request('search', {"path":"questions", body}, function(err,result){
        if (err){
            res.send({
                searchSuccess: false,
                questions_array: []
            })
        }else{
            res.send(result);
        }
    });
});

module.exports = router;
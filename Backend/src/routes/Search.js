var express = require('express');
var router = express.Router();
var kafka = require('./kafka/client');
const multer = require('multer');
const FormData = multer();

var jwt = require('jsonwebtoken');
var passport = require('passport');
var requireAuth = passport.authenticate('jwt', {session: false});

router.get('/topics/:searchText', (req,res,next) => {
    let body = {
        searchText: req.params.searchText
    }
    kafka.make_request('search', {"path":"topics", body}, function(err,result){
        if (err){
            res.status(400).send({
                searchSuccess: false,
                topics_array: []
            })
        }else{
            res.status(200).send(result);
        }
    });
});

router.get('/profiles/:searchText', FormData.none(), (req,res,next) => {
    let body = {
        searchText: req.params.searchText
    }
    kafka.make_request('search', {"path":"profiles", body}, function(err,result){
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
router.get('/questions/:searchText', (req,res,next) => {
    let body = {
        searchText: req.params.searchText
    }
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
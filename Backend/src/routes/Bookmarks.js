var express = require('express');
var router = express.Router();
var kafka = require('./kafka/client');
const multer = require('multer');
const FormData = multer();

var jwt = require('jsonwebtoken');
var passport = require('passport');
var requireAuth = passport.authenticate('jwt', {session: false});


router.post('/', (req,res,next) => {
    console.log("Inside Backend Bookmarks.js")
    kafka.make_request('bookmarks', {"path":"get", body: req.body}, function(err,result){
        if (err){
            res.status(400).send({
                bookmarksSuccess: false,
                bookmarks: []
            })
        }else{
            res.status(200).send(result);
        }
    });
});

module.exports = router;
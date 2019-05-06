var express = require('express');
var router = express.Router();
var kafka = require('./kafka/client');
const multer = require('multer');
const FormData = multer();
const userimage  =require('../models/DefaultUserImage');

var jwt = require('jsonwebtoken');
var passport = require('passport');
var requireAuth = passport.authenticate('jwt', {session: false});

router.get('/getRawImage',(req,res)=>{
    console.log(req.query);
    // yes make request to profile & reuse same code.
    kafka.make_request('profile',{"path":"get_profile_pic", "body": req.query}, function(err,result){
        if (err || result.status!== 200 || (result.status === 200 && result.base64[0].b64 === "default")) {
            const image = Buffer.from(userimage.defaultImage, 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/jpg',
                'Content-Length': image.length
            });
            res.end(image)
        }
        else{
            console.log(result);
            var base64Data = result.base64[0].b64.replace(/^data:image\/jpg;base64,/, '');
            const image = Buffer.from(base64Data, 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/jpg',
                'Content-Length': image.length
            });
            res.end(image)
        }
      });
})


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
            res.status(400).send({
                searchSuccess: false,
                questions_array: []
            })
        }else{
            res.status(200).send(result);
        }
    });
});

module.exports = router;
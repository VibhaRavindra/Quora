var express = require('express');
var router = express.Router();
var kafka = require('../routes/kafka/client');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const path = require('path');
var fs=require("fs");
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './uploads');
      },
      filename: (req, file, cb) => {
        const newFilename = `${uuidv4()}${path.extname(file.originalname)}`;
        console.log(newFilename)
        cb(null, newFilename);
      },
    });
    const upload = multer({ storage });


// Set up middleware
var passport = require('passport');
var requireAuth = passport.authenticate('jwt', {session: false});


router.route('/addtagline').post( function (req, res) {

  console.log("In addtagline Route");
  console.log(req.body);
  //user_name
  //tagline

  kafka.make_request('profile',{"path":"addtagline", "body": req.body}, function(error,result){
    if (error) {
      console.log(error);
      console.log("Question not found");
      res.status(400).json({responseMessage: 'Question not found'});
    } else {
      console.log("Question Found");
      
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result.result));
    }
  })
});

router.route('/addemployment').post( function (req, res) {

  console.log("In addtagline Route");
  console.log(req.body);
  //user_name
  //career

  kafka.make_request('profile',{"path":"addemployment", "body": req.body}, function(error,result){
    if (error) {
      console.log(error);
      console.log("Question not found");
      res.status(400).json({responseMessage: 'Question not found'});
    } else {
      console.log("Question Found");
      
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result.result));
    }
  })
});

router.route('/addeducation').post( function (req, res) {

  console.log("In addeducation Route");
  console.log(req.body);
  //user_name
  //education

  kafka.make_request('profile',{"path":"addeducation", "body": req.body}, function(error,result){
    if (error) {
      console.log(error);
      console.log("Question not found");
      res.status(400).json({responseMessage: 'Question not found'});
    } else {
      console.log("Question Found");
      
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result.result));
    }
  })
});

router.route('/addlocation').post( function (req, res) {

  console.log("In addeducation Route");
  console.log(req.body);
  //user_name
  //location

  kafka.make_request('profile',{"path":"addlocation", "body": req.body}, function(error,result){
    if (error) {
      console.log(error);
      console.log("Question not found");
      res.status(400).json({responseMessage: 'Question not found'});
    } else {
      console.log("Question Found");
      
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result.result));
    }
  })
});





router.route('/addprofilepic').post(upload.single('selectedFile'), (req, res) => {
  b64= new Buffer(fs.readFileSync(req.file.path)).toString("base64")
  console.log(req.param.user_name)
  
  kafka.make_request('profile',{"path":"addprofilepic", "body":req.dta }, function(error,result){
    if (error) {
      console.log(error);
      console.log("Question not found");
      res.status(400).json({responseMessage: 'Question not found'});
    } else {
    }
  })
  res.writeHead(200, {'content-type':'text/plain'});
  res.end(b64);
  res.send();
});

  router.route('/getprofileinfo').post( function (req, res) {

    console.log("In addprofilepic Route");
    console.log(req.body);
    //user_name
    
    kafka.make_request('profile',{"path":"getprofileinfo", "body": req.body}, function(error,result){
      if (error) {
        console.log(error);
        console.log("Question not found");
        res.status(400).json({responseMessage: 'Question not found'});
      } else {
        console.log("Question Found");
        
        res.writeHead(200, {'content-type':'application/json'});
        res.end(JSON.stringify(result.result));
      }
    })
  });

  router.route('/getfollowersinfo').post( function (req, res) {

    console.log("In addprofilepic Route");
    console.log(req.body);
    //user_name
    
    kafka.make_request('profile',{"path":"getfollowersinfo", "body": req.body}, function(error,result){
      if (error) {
        console.log(error);
        console.log("Question not found");
        res.status(400).json({responseMessage: 'Question not found'});
      } else {
        console.log("Question Found");
        
        res.writeHead(200, {'content-type':'application/json'});
        res.end(JSON.stringify(result.result));
      }
    })
  });
  router.route('/getfollowinginfo').post( function (req, res) {

    console.log("In addprofilepic Route");
    console.log(req.body);
    //user_name
    
    kafka.make_request('profile',{"path":"getfollowinginfo", "body": req.body}, function(error,result){
      if (error) {
        console.log(error);
        console.log("Question not found");
        res.status(400).json({responseMessage: 'Question not found'});
      } else {
        console.log("Question Found");
        
        res.writeHead(200, {'content-type':'application/json'});
        res.end(JSON.stringify(result.result));
      }
    })
  });

module.exports = router;
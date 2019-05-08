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

router.route("/healthcheck").get(function(req, res){
  kafka.make_request('profile', {"path":"healthcheck"}, function(err, result){
    if(err){
      res.status(400).json({});
    } else {
      res.status(200).json({});
    }
  })
})
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
      
      res.status(200).json({ responseMessage: 'Successfully Added!' });
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
  //zipcode
  //states

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

router.route('/adddescription').post( function (req, res) {

  console.log("In addeducation Route");
  console.log(req.body);
  //user_name
  //aboutme

  kafka.make_request('profile',{"path":"adddescription", "body": req.body}, function(error,result){
    if (error) {
      console.log(error);
      console.log("Question not found");
      res.status(400).json({responseMessage: 'Question not found'});
    } else {
   
      res.status(200).json({ responseMessage: 'Successfully Added!' });
    }
  })
});





router.route('/addprofilepic').post(upload.single('selectedFile'), (req, res) => {
  b64= new Buffer(fs.readFileSync(req.file.path)).toString("base64")
console.log(req.file.filename)
  var data={
    user_name:req.body.user_name,
     "b64":"data:image/jpg;base64,"+b64,
     "user_profile_pic":req.file.filename 
  }
  kafka.make_request('profile',{"path":"addprofilepic", "body":data }, function(error,result){
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

  router.route('/getprofileinfo').get( function (req, res) {

    console.log("In getprofileinfo Route");
    console.log(req.query);
    //user_name
    
    kafka.make_request('profile',{"path":"getprofileinfo", "body": req.query}, function(error,result){
      if (error) {
        console.log(error);
        console.log("Question not found");
        res.status(400).json({responseMessage: 'Question not found'});
      } else {
        console.log("Question Found");
        if(JSON.stringify(result.result)!=JSON.stringify({}))
      {  res.writeHead(200, {'content-type':'application/json'});
        res.end(JSON.stringify(result.result))}
        else{
          res.status(204).json({responseMessage: 'Profile not found'});
        }
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

  router.route('/profilepic').get(function (req, res) {
    console.log("Inside get profile pic");
    console.log("Request Body:");
    console.log(req.query);
    kafka.make_request('profile',{"path":"get_profile_pic", "body": req.query}, function(err,result){
      if (err) {
        console.log(err);
        res.status(500).json({ responseMessage: 'Database not responding' });
      }
      else if (result.status === 200)
      {
        console.log("Found pic");
        res.status(200).json({ 
          base64: result.base64
        });
      } else if (result.status === 204){
        console.log("No results found");
        res.status(200).json({ responseMessage: 'No results found' });
      }
    });
  });

module.exports = router;

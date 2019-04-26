var express = require('express');
var router = express.Router();
var kafka = require('./kafka/client');
const multer = require('multer');
const FormData = multer();

// Set up middleware
var passport = require('passport');
var requireAuth = passport.authenticate('jwt', { session: false });

router.post('/:question_id', requireAuth, (req, res) => {
    kafka.make_request('answer', {
        "path": "submit", "req": {
            "body": req.body,
            "params": req.params,
            "query": req.query
        }
    }, function (err, result) {
        console.log('in result');
        console.log(result);
        if (err) {
            res.send({
                submitAnswerSuccess: false,
                submitAnswerMessage: "Submit Answer Failed"
            })
        } else {
            res.send({
                submitAnswerSuccess: true,
                submitAnswerMessage: "Success"
            });
        }
    });
})

router.get('/:question_id', requireAuth, (req, res) => {
    console.log("Inside Quora Backend: Get One Answer");
    kafka.make_request('answer', {
        "path": "get-one", "req": {
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
            console.log("Answer Details:"+JSON.stringify(result));

            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(result));
        }
    })
})

module.exports = router;
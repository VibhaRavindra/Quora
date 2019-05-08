var express = require('express');
var router = express.Router();
var kafka = require('./kafka/client');
const multer = require('multer');
const FormData = multer();

// Set up middleware
var passport = require('passport');
var requireAuth = passport.authenticate('jwt', { session: false });

router.post('/:question_id', (req, res) => {
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
            res.status(400).send({
                submitAnswerSuccess: false,
                submitAnswerMessage: "Submit Answer Failed"
            })
        } else {
            res.status(200).send({
                submitAnswerSuccess: true,
                submitAnswerMessage: "Success"
            });
        }
    });
})

router.post('/:question_id/:answer_id/comment', (req, res) => {
    kafka.make_request('answer', {
        "path": "submit-comment", "req": {
            "body": req.body,
            "params": req.params,
            "query": req.query
        }
    }, function (err, result) {
        console.log('in result');
        console.log(result);
        if (err) {
            res.status(400).send({
                submitCommentSuccess: false,
                submitCommentMessage: "Submit Comment Failed"
            })
        } else {
            res.status(200).send({
                submitCommentSuccess: true,
                submitCommentMessage: "Success"
            });
        }
    });
})

router.post('/:question_id/:answer_id', (req, res) => {
    if (req.query.upvote) {
        console.log("Upvote: " + req.query.upvote)
        kafka.make_request('answer', {
            "path": "submit-upvote", "req": {
                "body": req.body,
                "params": req.params,
                "query": req.query
            }
        }, function (err, result) {
            console.log('in result');
            console.log(result);
            if (err) {
                res.status(400).send({
                    submitUpvoteSuccess: false,
                    submitUpvoteMessage: "Submit Upvote Failed"
                })
            } else {
                res.status(200).send({
                    submitUpvoteSuccess: true,
                    submitUpvoteMessage: "Success"
                });
            }
        });
    } else if(req.query.downvote) {
        console.log("Downvote: " + req.query.downvote)
        kafka.make_request('answer', {
            "path": "submit-downvote", "req": {
                "body": req.body,
                "params": req.params,
                "query": req.query
            }
        }, function (err, result) {
            console.log('in result');
            console.log(result);
            if (err) {
                res.status(400).send({
                    submitDownvoteSuccess: false,
                    submitDownvoteMessage: "Submit Downvote Failed"
                })
            } else {
                res.status(200).send({
                    submitDownvoteSuccess: true,
                    submitDownvoteMessage: "Success"
                });
            }
        });
    } else {
        res.status(400).send({
            submitVoteSuccess: false,
            submitDownvoteMessage: "Submit Vote Failed"
        })
    }
})

router.post('/:question_id/:answer_id/bookmark', (req, res) => {
    if (req.query.bookmarkState) {
        console.log("Bookmark State: " + req.query.bookmarkState)
        kafka.make_request('answer', {
            "path": "submit-bookmark", "req": {
                "body": req.body,
                "params": req.params,
                "query": req.query
            }
        }, function (err, result) {
            console.log('in result');
            console.log(result);
            if (err) {
                res.status(400).send({
                    submitBookmarkSuccess: false,
                    submitBookmarkMessage: "Submit Bookmark Failed"
                })
            } else {
                res.status(200).send({
                    submitBookmarkSuccess: true,
                    submitBookmarkMessage: "Success"
                });
            }
        });
    } else {
        res.status(400).send({
            submitBookmarkSuccess: false,
            submitBookmarkMessage: "Submit bookmark Failed"
        })
    }
})

router.get('/:question_id', (req, res) => {
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
            console.log("Answer Details:" + JSON.stringify(result));

            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(result));
        }
    })
})

module.exports = router;
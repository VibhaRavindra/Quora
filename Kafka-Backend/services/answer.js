var { users } = require('../models/UserSchema');
var { questions } = require('../models/QuestionSchema');
var { answers } = require('../models/AnswerSchema');
var { comments } = require('../models/CommentSchema');
var {views} =require('../models/AnswerViewSchema')

exports.answerService = function answerService(msg, callback) {
    console.log("Inside kafka backend answer.js");
    // console.log("msg"+ msg);
    console.log("msg", msg);
    console.log("In Property Service path:", msg.path);
    switch (msg.path) {
        case "submit":
            submitAnswer(msg.req, callback);
            break;
        case "submit-comment":
            submitComment(msg.req, callback);
            break;
        case "submit-upvote":
            submitUpvote(msg.req, callback);
            break;
        case "submit-downvote":
            submitDownvote(msg.req, callback);
            break;
        case "get-one":
            getAllAnswers(msg.req, callback);
            break;
            case "graphupvote":
            graphupvote(msg, callback);
            break;
            case "graphdownvote":
            graphdownvote(msg, callback);
            break;
           
    }
};

async function submitAnswer(message, callback) {
    console.log(message.params.question_id);
    try {
        var newAnswer = new answers({
            answer: message.body.answer,
            question_id: message.params.question_id,
            owner_username: message.body.user_username,
            owner_name: message.body.user_name,
            owner_tagline: message.body.user_tagline,
            owner_profile_pic: message.body.user_profile_pic,
            upvote_count: 0,
            downvote_count: 0

        });
        var answer = await newAnswer.save();
        console.log(JSON.stringify(answer))
        var questionUpdated = await questions.update({ "_id": message.params.question_id }, {
            $push: {
                answers: answer
            }
        });

        callback(null, { updateStatus: "Success", question: questionUpdated })

    } catch (error) {
        console.log("Submit Answer Failed: " + error)
        callback(null, {
            status: 400,
            submitAnswerMessage: "Submit Answer Failed"
        })
    }

}

async function submitComment(message, callback) {
    console.log(message.params.question_id);
    try {
        var newComment = new comments({
            comment: message.body.comment,
            owner_username: message.body.user_username,
            owner_name: message.body.user_name,
            owner_profile_pic: message.body.user_profile_pic
        });

        var comment = await newComment.save();
        console.log(JSON.stringify(comment))
        var questionUpdated = await questions.update({ "_id": message.params.question_id, "answers._id": message.params.answer_id}, {
            $push: {
                "answers.$.comments": comment
            }
        });

        var answerUpdated = await answers.update({ "_id": message.params.answer_id }, {
            $push: {
                comments: comment
            }
        }); 

        callback(null, { updateStatus: "Success", question: questionUpdated })

    } catch (error) {
        console.log("Submit Comment Failed: " + error)
        callback(null, {
            status: 400,
            submitCommentMessage: "Submit Comment Failed"
        })
    }

}
async function submitComment(message, callback) {
    console.log(message.params.question_id);
    try {
        var newComment = new comments({
            comment: message.body.comment,
            owner_username: message.body.user_username,
            owner_name: message.body.user_name,
            owner_profile_pic: message.body.user_profile_pic
        });

        var comment = await newComment.save();
        console.log(JSON.stringify(comment))
        var questionUpdated = await questions.update({ "_id": message.params.question_id, "answers._id": message.params.answer_id}, {
            $push: {
                "answers.$.comments": comment
            }
        });

        var answerUpdated = await answers.update({ "_id": message.params.answer_id }, {
            $push: {
                comments: comment
            }
        }); 

        callback(null, { updateStatus: "Success", question: questionUpdated })

    } catch (error) {
        console.log("Submit Comment Failed: " + error)
        callback(null, {
            status: 400,
            submitCommentMessage: "Submit Comment Failed"
        })
    }

}
async function submitUpvote(message, callback) {
    console.log(message.params.question_id);
    try {
        var upvoteState = message.query.upvote;
        console.log(JSON.stringify(upvoteState))

        if(upvoteState === "true") {
        var questionUpdated = await questions.update({ "_id": message.params.question_id, "answers._id": message.params.answer_id}, {
            $push: {
                "answers.$.upvotes": message.body.user_username
            },
            $inc: {
                "answers.$.upvote_count": 1
            }
        });

        var answerUpdated = await answers.update({ "_id": message.params.answer_id }, {
            $push: {
                upvotes: message.body.user_username
            },
            $inc: {
                upvote_count: 1
            }
        }); 

        callback(null, { updateStatus: "Success", question: questionUpdated })
    } else if(upvoteState === "false") {
        var questionUpdated = await questions.update({ "_id": message.params.question_id, "answers._id": message.params.answer_id}, {
            $pull: {
                "answers.$.upvotes": message.body.user_username
            },
            $inc: {
                "answers.$.upvote_count": -1
            }
        });

        var answerUpdated = await answers.update({ "_id": message.params.answer_id }, {
            $pull: {
                upvotes: message.body.user_username
            },
            $inc: {
                upvote_count: -1
            }
        }); 

        callback(null, { updateStatus: "Success", question: questionUpdated })
    } else {
        throw "invalid upvote state"
    }
    } catch (error) {
        console.log("Submit Comment Failed: " + error)
        callback(null, {
            status: 400,
            submitCommentMessage: "Submit Comment Failed"
        })
    }

}

async function submitDownvote(message, callback) {
    console.log(message.params.question_id);
    try {
        var downvoteState = message.query.downvote;
        console.log(JSON.stringify(downvoteState))

        if(downvoteState === "true") {
        var questionUpdated = await questions.update({ "_id": message.params.question_id, "answers._id": message.params.answer_id}, {
            $push: {
                "answers.$.downvotes": message.body.user_username
            },
            $inc: {
                "answers.$.downvote_count": 1
            }
        });

        var answerUpdated = await answers.update({ "_id": message.params.answer_id }, {
            $push: {
                downvotes: message.body.user_usernamezx
            },
            $inc: {
                downvote_count: 1
            }
        }); 

        callback(null, { updateStatus: "Success", question: questionUpdated })
    } else if(downvoteState === "false") {
        var questionUpdated = await questions.update({ "_id": message.params.question_id, "answers._id": message.params.answer_id}, {
            $pull: {
                "answers.$.downvotes": message.body.user_username
            },
            $inc: {
                "answers.$.downvote_count": -1
            }
        });

        var answerUpdated = await answers.update({ "_id": message.params.answer_id }, {
            $pull: {
                downvotes: message.body.user_username
            },
            $inc: {
                downvote_count: 1
            }
        }); 

        callback(null, { updateStatus: "Success", question: questionUpdated })
    } else {
        throw "invalid downvote state"
    }
    } catch (error) {
        console.log("Submit Comment Failed: " + error)
        callback(null, {
            status: 400,
            submitCommentMessage: "Submit Comment Failed"
        })
    }

}

async function getAllAnswers(message, callback) {
    console.log("Inside Kafka-Backend: Getting All Answers for a question")
    console.log(message.params.answer_id);
    try {
        var question = await questions.findById(message.params.question_id);
        console.log(question)

        callback(null, { updateStatus: "Success", question: question })

    } catch (error) {
        console.log("Getting Answer Failed: " + error)
        callback(null, {
            status: 400,
            submitAnswerMessage: "Getting Answer Failed"
        })
    }

}

async function graphupvote(message, callback) {
    
    try {
        
        var answer = await answers.find({owner_username:message.body.owner_username},{"_id":1,"upvote_count":1}).sort(
            { 
                "upvote_count" : -1.0, 
                "downvote_count" : 1.0
            }
        ).limit(10);
        console.log(answer)

        callback(null, { updateStatus: "Success", answer: answer })

    } catch (error) {
        console.log("Getting Answer Failed: " + error)
        callback(null, {
            status: 400,
            submitAnswerMessage: "Getting Answer Failed"
        })
    }

}




async function graphdownvote(message, callback) {
    
    try {
        var answer = await answers.find({owner_username:message.body.owner_username},{"_id":1,"downvote_count":1}).sort(
            { 
                "downvote_count" : -1.0, 
                "upvote_count" : 1.0
            }
        ).limit(10);
        console.log(answer)

        callback(null, { updateStatus: "Success", answer: answer })

    } catch (error) {
        console.log("Getting Answer Failed: " + error)
        callback(null, {
            status: 400,
            submitAnswerMessage: "Getting Answer Failed"
        })
    }

}



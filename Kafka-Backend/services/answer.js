var { users } = require('../models/UserSchema');
var { questions } = require('../models/QuestionSchema');
var { answers } = require('../models/AnswerSchema');
var { comments } = require('../models/CommentSchema');

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
        case "get-one":
            getAllAnswers(msg.req, callback);
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
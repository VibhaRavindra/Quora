var {users} = require('../models/UserSchema');
var {questions} = require('../models/QuestionSchema');

exports.followService = function followService(msg, callback){
    console.log("Inside kafka backend yourcontent.js");
    console.log("msg", msg);
    console.log("In Property Service path:", msg.path);
    switch(msg.path){
        case "questions_asked":
            questions_asked(msg,callback);
            break;
        case "questions_followed":
            questions_followed(msg,callback);
            break;
        case "questions_answered":
            questions_answered(msg,callback);
            break;
    }
};

function questions_asked(msg, callback){
    questions.find({ owner_id : msg.body.userid }, { question: 1, timestamp: 1 },function(err, results) {
        let questions_asked_array = []
        if(err) {
            console.log(err)
            callback(null, {
                questionsAskedSuccess: false,
                questions_asked_array: questions_asked_array
            })
        } else {
            results.forEach((result)=>{
                questions_asked_array.push({
                    questionid: result._id,
                    question: result.question,
                    timestamp: result.timestamp
                })
            })
            callback(null, {
                questionsAskedSuccess: true,
                questions_asked_array: questions_asked_array
            });
        }
    });
}

function questions_followed(msg, callback){
    users.find({ _id : msg.body.userid }, { questions_followed: 1},function(err, results) {
        let questions_followed_array = []
        if(err) {
            console.log(err)
            callback(null, {
                questionsFollowedSuccess: false,
                questions_followed_array: questions_followed_array
            })
        } else {
            results[0].questions_followed.forEach((result)=>{
                console.log(result);
                questions_followed_array.push({
                    questionid: result.qid,
                    question: result.question,
                    timestamp: result.timestamp
                })
            })
            callback(null, {
                questionsFollowedSuccess: true,
                questions_followed_array: questions_followed_array
            });
        }
    });
}

function questions_answered(msg, callback){
    users.find({ _id : msg.body.userid }, { questions_followed: 1},function(err, results) {
        let questions_followed_array = []
        if(err) {
            console.log(err)
            callback(null, {
                questionsFollowedSuccess: false,
                questions_followed_array: questions_followed_array
            })
        } else { 
            results[0].questions_followed.forEach((result)=>{
                console.log(result);
                questions_followed_array.push({
                    questionid: result.qid,
                    question: result.question,
                    timestamp: result.timestamp
                })
            })
            callback(null, {
                questionsFollowedSuccess: true,
                questions_followed_array: questions_followed_array
            });
        }
    });
}


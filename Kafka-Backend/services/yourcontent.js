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
        // case "questions":
        //     console.log("in questions case")
        //     questions_search(msg,callback);
        //     break;
    }
};

function questions_asked(msg, callback){
    console.log("in questions_asked")
    questions.find({ owner_id : msg.body.userid }, { question: 1, timestamp: 1 },function(err, results) {
        console.log("in questions_asked exec.")
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
    console.log("in questions_followed")
    users.find({ _id : msg.body.userid }, { questions_followed: 1},function(err, results) {
        console.log("in questions_asked exec.")
        let questions_followed_array = []
        if(err) {
            console.log(err)
            callback(null, {
                questionsFollowedSuccess: false,
                questions_followed_array: questions_followed_array
            })
        } else {
            console.log("questions_followed : ", questions_followed)
            results.forEach((result)=>{
                questions_followed_array.push({
                    questionid: result.questions_followed.qid,
                    question: result.question
                })
            })
            callback(null, {
                questionsFollowedSuccess: true,
                questions_followed_array: questions_followed_array
            });
        }
    });
}


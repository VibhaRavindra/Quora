var {users} = require('../models/UserSchema');
var {questions} = require('../models/QuestionSchema');
var {answers} = require('../models/AnswerSchema');

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
        case "getanswer":
            getanswer(msg,callback);
            break;
    }
};

function getanswer(message, callback) {
    console.log("Inside Kafka-Backend: Getting One Answers for a question")
    let answerid = message.req.params.answerId
    let questionid = message.req.params.question_id;
    console.log("questionid",questionid)
    console.log("answerid",answerid)
    try {
        questions.findOne({'answers._id':answerid},{"answers.$":1,question:1},(err, result)=>{
            console.log("result",result)
            callback(null, { updateStatus: "Success", question: result })
        });
    } catch (error) {
        console.log("Getting Answer Failed: " + error)
        callback(null, {
            status: 400,
            submitAnswerMessage: "Getting Answer Failed"
        })
    }

}

function questions_asked(msg, callback){
    console.log("Inside Kafka-Backend: Getting all the questions asked by the user")
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
    console.log("Inside Kafka-Backend: Getting all the questions followed by the user")
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
    answers.find({ owner_userid : msg.body.userid }, { question_id: 1, timestamp: 1},function(err, results) {
        let questions_answered_array = []
        if(err) {
            console.log(err)
            callback(null, {
                questionsAnsweredSuccess: false,
                questions_answered_array: questions_answered_array
            })
        } else {
            let questionid_array = []
            let question_answer_map = {}
            let question_timestamp_map = {}
            for(let i=0; i<results.length; i++){
                questionid_array.push(results[i].question_id);
                question_answer_map[results[i].question_id] = results[i]._id;
                question_timestamp_map[results[i].question_id] = results[i].timestamp;
            }
            questions.find({_id:questionid_array}, function(err, result){
                if(err){
                    console.log(err)
                    callback(null, {
                        questionsAnsweredSuccess: false,
                        questions_answered_array: questions_answered_array
                    })
                } else {
                    console.log("result.length : : : : : ",result.length);
                    for (let i=0; i<result.length; i++){
                        console.log("result.question : : : : : ",result[i].question);
                        questions_answered_array.push({
                            question: result[i].question,
                            questionid: result[i]._id,
                            timestamp: question_timestamp_map[result[i]._id],
                            answer_id:question_answer_map[result[i]._id]
                        })
                    }
                    callback(null, {
                        questionsAnsweredSuccess: true,
                        questions_answered_array: questions_answered_array
                    });
                }
            })
        }
    });
}


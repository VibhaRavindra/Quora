var Questions = require('../models/QuestionSchema');
var Users = require('../models/UserSchema');

exports.questionService = function questionService(msg, callback) {
    console.log("In question Service path:", msg.path);
    switch (msg.path) {
        case "new_question":
            createQuestion(msg, callback);
            break;
        case "get_all_questions":
            getAllQuestions(msg, callback);
            break;
        case "get_topic_questions":
            getTopicQuestions(msg, callback);
            break;
    }
}


function createQuestion(msg, callback) {

    console.log("In create question. Msg: ", msg);
    let timestamp = new Date();
    let questionData = {
        "question": msg.body.question,
        "topic_name": msg.body.topic_name,
        "owner_id": msg.body.owner_id,
        "owner_name": msg.body.owner_name,
        "owner_username": msg.body.owner_username,
        "timestamp" : timestamp
    }
    // console.log("question data:", questionData);
    Questions.questions.findOne({ "question": msg.body.question }, function (err, rows) {
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (rows) {
                callback(null, { status: 401, result: "Question already exists" });
            }
            else {
                Questions.questions.create(questionData, function (err, results) {
                    if (err) {
                        console.log(err);
                        callback(err, "Database Error");
                    } else {
                        if (results) {
                            console.log("Saved to questions Successful");
                            Users.users.findOneAndUpdate({ "user_name": msg.body.owner_username }, { $push: { questions_asked: {"question": msg.body.question, "timestamp": timestamp} } }, function (error,result) {
                                if (error) {
                                    console.log(error.message)
                                    callback(null, {status:400,error});
                                } else {
                                    callback(null, {status: 200});
                                }
                            });
                        }
                        else {
                            console.log("Unable to save data");
                            callback(null, { status: 500, result: "Unable to save data" });
                        }
                    }
                });
            }
        }
    });
}


function getAllQuestions(msg, callback) {

    sort = {'timestamp': -1}
    // console.log("In get questions. Msg: ", msg);
    Questions.questions.find({ }, { question : 1, answers: 1, followers: 1 }, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                callback(null, { status: 200, questions: results });
            }
            else {
                callback(null, { status: 204, questions: "no data found" });
            }
        }
    }).sort(sort);
}

function getTopicQuestions(msg, callback) {

    sort = {'timestamp': -1}
    console.log("In get topic questions. Msg: ", msg);
    Questions.questions.find({"topic_name" : (msg.body.topic).toLowerCase() },{question : 1, answers: 1, followers: 1}, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                callback(null, { status: 200, questions: results });
            }
            else {
                callback(null, { status: 204, questions: "no data found" });
            }
        }
    }).sort(sort);
}
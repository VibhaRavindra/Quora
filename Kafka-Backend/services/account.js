const bcrypt = require('bcrypt');
const saltRounds = 2;
var { users } = require('../models/UserSchema');
var { topics } = require('../models/TopicSchema');
var { questions } = require('../models/QuestionSchema');
var { answers } = require('../models/AnswerSchema');
var { comments } = require('../models/CommentSchema');
const mysql = require('mysql');

// MySQL connection without pooling.
var mysqlconnection = mysql.createConnection({
    host: "quora273.cnqjulff3ok3.us-east-2.rds.amazonaws.com",
    user: "CMPE273_Quora",
    password: "Quora_273_project",
    database: "CMPE273_Quora"
});

mysqlconnection.connect(err => {
    if (err)
        throw err;
})

// MySQL connection with pooling
// var mysqlconnection = mysql.createPool({
//     connectionLimit: 10,
//     host: 'quora273.cnqjulff3ok3.us-east-2.rds.amazonaws.com',
//     user: 'CMPE273_Quora',
//     password: 'Quora_273_project',
//     database: 'CMPE273_Quora'
// })

exports.followService = function followService(msg, callback) {
    console.log("Inside kafka backend account.js");
    // console.log("msg"+ msg);
    console.log("msg", msg);
    console.log("In Property Service path:", msg.path);
    switch (msg.path) {
        case "signup":
            signup(msg, callback);
            break;
        case "signin":
            signin(msg, callback);
            break;
        case "selectedTopics":
            selectedTopics(msg, callback);
            break;
        case "deactivate":
            deactivate(msg, callback);
            break;
        case "delete":
            deleteMethod(msg, callback);
            break;
        default:
            deleteMongo(msg, callback);
    }
};

function deleteMongo(msg, callback) {
    switch(msg.path){
        case "delete-user":
            console.log("In delete mongo ", msg.path)
            users.deleteOne({user_name:msg.body.user_name});
            break;
        case "delete-answers":
            console.log("In delete mongo ", msg.path)
            answers.deleteMany({ owner_username: msg.body.user_name });
            break;
        case "delete-comments":
        console.log("In delete mongo ", msg.path)
            comments.deleteMany({ owner_username: msg.body.user_name });
            break;
        case "delete-questions_answers":
        console.log("In delete mongo ", msg.path)
            questions.update({"answers.owner_username":msg.body.user_name}, {$pull:{"answers.$":{owner_username:msg.body.user_name}}})
            break;
        case "delete-users_bookmarks_answers":
        console.log("In delete mongo ", msg.path)
            users.update({"bookmarks.answers.owner_username":msg.body.user_name}, {$pull:{"bookmarks.$.answers.$":{owner_username:msg.body.user_name}}})
            break;
    }
}
function signup(msg, callback) {
    let hashpw;
    bcrypt.hash(msg.body.password, saltRounds, function (err, hash) {
        if (err) {
            console.log(err)
        }
        hashpw = hash;
    });
    let newUser = new users({ user_name: msg.body.user_name, firstname:msg.body.firstname, lastname:msg.body.lastname })
    let mongo_userid = String(newUser._id);
    mysqlconnection.beginTransaction(function (err) {
        if (err) {
            console.log("INSIDE ERROR 1")
            callback(null, {
                signupSuccess: false,
                signupMessage: "Sign Up Failed"
            })
        }
        const signUpQuery = "INSERT INTO Users(user_name, password, mongo_userid) VALUES(?,?,?)"
        mysqlconnection.query(signUpQuery, [msg.body.user_name, hashpw, mongo_userid], (err, result) => {
            if (err) {
                console.log(err)
                console.log("INSIDE ERROR 2")
                mysqlconnection.rollback(function (err) {
                    if (err)
                        console.log(err)
                });
                callback(null, {
                    signupSuccess: false,
                    signupMessage: "User already Exists!"
                })
            } else {
                newUser.save(function (err, result) {
                    if (err) {
                        console.log("err newUser save")
                        console.log(err)
                        mysqlconnection.rollback(function (err) {
                            if (err)
                                console.log(err)
                        });
                        callback(null, {
                            signupSuccess: false,
                            signupMessage: "Sign Up Failed"
                        })
                    } else {
                        mysqlconnection.commit(function (err) {
                            if (err) {
                                mysqlconnection.rollback(function (err) {
                                    if (err)
                                        console.log(err)
                                });
                                callback(null, {
                                    signupSuccess: false,
                                    signupMessage: "Sign Up Failed"
                                })
                            } else {
                                callback(null, {
                                    signupSuccess: true,
                                    signupMessage: "Sign Up Success. Sign In to continue!"
                                })
                            }
                        });
                    }
                })
            }
        })
    })
}

function deactivate(msg, callback) {
    signinHelper(msg, (returnvalue) => {
        if (returnvalue.signinSuccess) {
            users.updateOne({ _id: returnvalue.userid }, { '$set': { status: "Deactivated" } }, (err, res) => {
                if (err) {
                    console.log(err)
                    callback(null, { deactivateSuccess: false })
                }
                else {
                    answers.updateMany({ owner_userid: returnvalue.userid }, { '$set': { owner_status: "Deactivated" } }, (err, res) => {
                        if (err) {
                            console.log(err)
                            callback(null, { deactivateSuccess: false })
                        } else {
                            questions.updateMany({ "answers.owner_userid": returnvalue.userid }, { '$set': { "answers.$.owner_status": "Deactivated" } }, (err, res) => {
                                if (err) {
                                    console.log(err)
                                    callback(null, { deactivateSuccess: false })
                                } else {
                                    users.updateMany({"bookmarks.answers.0.owner_userid": returnvalue.userid }, { '$set': { "bookmarks.$.answers.0.owner_status": "Deactivated" } }, (err, res) => {
                                        if (err) {
                                            console.log(err)
                                            callback(null, { deactivateSuccess: false })
                                        } else {
                                            console.log(":mongo all set, user deactivated.")
                                            callback(null, { deactivateSuccess: true })
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            callback(null, { deactivateSuccess: false })
        }
    })
}

// should delete from users, answers, bookmarks, comments, questions.answers, users.bookmarks.answers.
function deleteMethod(msg, callback) {
    signinHelper(msg, (returnvalue) => {
        if (returnvalue.signinSuccess) {
            console.log("In delete method after good passwrod ", msg.path)
            mysqlconnection.beginTransaction((err)=>{
            mysqlconnection.query('DELETE FROM Users WHERE user_name=?', [msg.body.user_name], (err, res) => {
                if (err) {
                    console.log("INSIDE ERROR 2", err)
                    callback(null, { deleteSuccess: false })
                } else {
                    console.log(res);
                    console.log("users.deleteOne")
                    users.deleteOne({user_name:msg.body.user_name},(e,r)=>{

                    answers.deleteMany({ owner_username:msg.body.user_name },(e,r)=>{

                    comments.deleteMany({ owner_username: msg.body.user_name },(e,r)=>{

                    questions.update({"answers.owner_username":msg.body.user_name}, {$pull:{"answers":{owner_username:msg.body.user_name}}},(e,r)=>{
                    users.update({"bookmarks.answers.owner_username":msg.body.user_name}, {$pull:{"bookmarks.$.answers":{owner_username:msg.body.user_name}}},(e,r)=>{
                        mysqlconnection.commit((e)=>{
                            console.log("ALL MONG DELETION DONE.")
                            callback(null, { deleteSuccess: true })
                        })
                    })
                    });
                    });   
                    });
                    });
                }
            })
            });
        } else {
            callback(null, { deleteSuccess: false })
        }
    })
}
function signinHelper(msg, callback) {
    console.log("Inside signinHelper");
    mysqlconnection.beginTransaction(function (err) {
        if (err) {
            console.log("INSIDE ERROR 1")
            callback({
                signinSuccess: false,
                signinMessage: "Sign In Failed",
                deactivated: false
            })
        }
        mysqlconnection.query('SELECT * FROM Users WHERE user_name=?', [msg.body.user_name],
            function (err, rowsOfTable) {
                if (err) {
                    mysqlconnection.rollback(function (err) {
                        if (err)
                            console.log(err)
                    });
                    callback({
                        signinSuccess: false,
                        signinMessage: "Sign In Failed",
                        deactivated: false
                    })
                }
                if (rowsOfTable.length == 1) {
                    var result = bcrypt.compareSync(msg.body.password, rowsOfTable[0].password);
                    if (result) {
                        console.log("SIGNIN SUCCESS")
                        console.log(rowsOfTable[0].mongo_userid)
                        users.findOne({ _id: rowsOfTable[0].mongo_userid }, function (err, result) {
                            if (err) {
                                mysqlconnection.rollback(function (err) {
                                    if (err)
                                        console.log(err)
                                });
                                callback({
                                    signinSuccess: false,
                                    signinMessage: "Sign In Failed",
                                    deactivated: false
                                })
                            }
                            if (result === null) {
                                console.log("NO USER FOUND")
                                callback({
                                    signinSuccess: false,
                                    signinMessage: "User does not Exist!"
                                })
                            } else {
                            let topics = result.topics_followed;
                            let isTopicSelected;
                            if (topics.length > 0) {
                                isTopicSelected = true;
                            } else {
                                isTopicSelected = false;
                            }
                            console.log("topics : ", topics);
                            callback({
                                signinSuccess: true,
                                user_name: result.user_name,
                                firstname: result.firstname,
                                lastname: result.lastname,
                                userid: result._id,
                                topics: topics,
                                isTopicSelected: isTopicSelected,
                                signinMessage: "Success!",
                                deactivated: result.status === "Deactivated"
                            })
                            }
                        })
                    } else {
                        console.log("INSIDE PASS FAIL")
                        mysqlconnection.rollback(function (err) {
                            if (err)
                                console.log(err)
                        });
                        callback({
                            signinSuccess: false,
                            signinMessage: "Password Incorrect!"
                        })
                    }
                } else {
                    console.log("NO USER FOUND")
                    callback({
                        signinSuccess: false,
                        signinMessage: "User does not Exist!"
                    })
                }
            })
    })

}
function signin(msg, callback) {
    signinHelper(msg, (returnvalue) => {
        console.log("returnvalue", returnvalue)
        if (returnvalue.deactivated && returnvalue.signinSuccess) {
            users.updateOne({ _id: returnvalue.userid }, { '$set': { status: "Activated" } }, (err, res) => {
                if (err) {
                    console.log(err)
                    callback(null, {
                        signinSuccess: false,
                        signinMessage: "Sign In Failed",
                        deactivated: false
                    })
                }
                else {
                    // update answers
                    answers.updateMany({ owner_userid: returnvalue.userid }, { '$set': { owner_status: "Activated" } }, (err, res) => {
                        if (err) {
                            console.log(err)
                            callback(null, {
                                signinSuccess: false,
                                signinMessage: "Sign In Failed",
                                deactivated: false
                            })
                        } else {
                            questions.updateMany({ "answers.owner_userid": returnvalue.userid }, { '$set': { "answers.$.owner_status": "Activated" } }, (err, res) => {
                                if (err) {
                                    console.log(err)
                                    callback(null, {
                                        signinSuccess: false,
                                        signinMessage: "Sign In Failed",
                                        deactivated: false
                                    })
                                } else {
                                    users.updateMany({"bookmarks.answers.0.owner_userid": returnvalue.userid }, { '$set': { "bookmarks.$.answers.0.owner_status": "Activated" } }, (err, res) => {
                                        if (err) {
                                            console.log(err)
                                            callback(null, {
                                                signinSuccess: false,
                                                signinMessage: "Sign In Failed",
                                                deactivated: false
                                            })
                                        } else {
                                            console.log(":mongo all set, user Activated.")
                                            callback(null, returnvalue)
                                        }
                                    })  
                                }
                            });
                        }
                    })
                }
            });
        } else {
            callback(null, returnvalue)
        }
    });
}

function selectedTopics(msg, callback) {
    
    users.findOneAndUpdate({ _id: msg.body.userid }, { $push: { topics_followed: { $each: msg.body.topics } } }, function (err, result) {
        if (err) {
            console.log(err)
            callback(null, {
                selectTopicsSuccess: false,
                select_topics: false,
                isTopicSelected: false,
                topics: []
            })
        } else {
            var criteria = {
                name: { $in: msg.body.topics }
            };
            topics.updateMany(criteria, { $inc: { num_of_followers: 1 } }
                , function (err, result) {
                    if (err) {
                        console.log(err)
                        callback(null, {
                            selectTopicsSuccess: false,
                            select_topics: false,
                            isTopicSelected: false,
                            topics: []
                        })
                    } else {
                        for (let i = 0; i < result.length; i++) {
                            console.log("Topics name : ", result[0].name)
                            console.log("Topics followers : ", result[0].num_of_followers)
                        }

                        callback(null, {
                            selectTopicsSuccess: true,
                            select_topics: true,
                            topics: msg.body.topics,
                            isTopicSelected: true
                        })
                    }
                })
        }
    })
}
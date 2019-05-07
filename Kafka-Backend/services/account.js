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
    }
};

function signup(msg, callback) {
    let hashpw;
    bcrypt.hash(msg.body.password, saltRounds, function (err, hash) {
        if (err) {
            console.log(err)
        }
        hashpw = hash;
    });
    let newUser = new users({ user_name: msg.body.user_name, firstname: msg.body.firstname, lastname: msg.body.lastname })
    let mongo_userid = String(newUser._id);
    mysqlconnection.beginTransaction(function (err) {
        if (err) {
            console.log("INSIDE ERROR 1")
            callback(null, {
                signupSuccess: false,
                signupMessage: "Sign Up Failed"
            })
            // throw err; 
        }
        const signUpQuery = "INSERT INTO Users(user_name,firstname,lastname, password, mongo_userid) VALUES(?,?,?,?,?)"
        mysqlconnection.query(signUpQuery, [msg.body.user_name, msg.body.firstname, msg.body.lastname, hashpw, mongo_userid], (err, result) => {
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

function deleteMethod(msg, callback) {
    signinHelper(msg, (returnvalue) => {
        if (returnvalue.signinSuccess) {
            mysqlconnection.beginTransaction(function (err) {
                if (err) {
                    console.log("INSIDE ERROR 1")
                    callback(null, { deleteSuccess: false })
                } else {
                    mysqlconnection.query('DELETE FROM Users WHERE user_name=?', [msg.body.user_name], (err, res) => {
                        if (err) {
                            console.log("INSIDE ERROR 2", err)
                            callback(null, { deleteSuccess: false })
                        } else {
                            users.deleteOne({ _id: returnvalue.userid }, (err, res) => {
                                if (err) {
                                    console.log(err)
                                    mysqlconnection.rollback();
                                    callback(null, { deleteSuccess: false })
                                }
                                else {
                                    answers.deleteMany({ owner_userid: returnvalue.userid }, (err, res) => {
                                        if (err) {
                                            console.log(err)
                                            mysqlconnection.rollback();
                                            callback(null, { deleteSuccess: false })
                                        }
                                        else {
                                            comments.deleteMany({ owner_username: returnvalue.user_name }, (err, res) => {
                                                if (err) {
                                                    console.log(err);
                                                    mysqlconnection.rollback();
                                                    callback(null, { deleteSuccess: false })
                                                }
                                                else {
                                                    mysqlconnection.commit();
                                                    callback(null, { deleteSuccess: true })
                                                }
                                            });
                                        }
                                    })
                                }
                            })
                        }
                    });
                }
            })
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
                        console.log(rowsOfTable[0].firstname)
                        console.log(rowsOfTable[0].lastname)
                        console.log(rowsOfTable[0].mongo_userid)
                        console.log(rowsOfTable[0].select_topics)
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
                            }
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
                                user_name: rowsOfTable[0].user_name,
                                firstname: rowsOfTable[0].firstname,
                                lastname: rowsOfTable[0].lastname,
                                userid: rowsOfTable[0].mongo_userid,
                                topics: topics,
                                isTopicSelected: isTopicSelected,
                                signinMessage: "Success!",
                                deactivated: result.status === "Deactivated"
                            })
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
    // mysqlconnection.beginTransaction(function(err) {
    //     if (err) { 
    //         callback(null,{
    //             selectTopicsSuccess:false,
    //             select_topics: false,
    //             isTopicSelected: false,
    //             topics: []
    //         })
    //     }
    //     console.log("msg.body.user_name ",msg.body.user_name)
    //     const query = "UPDATE Users SET select_topics = ? WHERE user_name = ?"
    //     mysqlconnection.query(query,[1,msg.body.user_name],(err,result)=>{
    //         if(err){
    //             console.log(err)
    //             mysqlconnection.rollback(function(err) {
    //                 if(err)
    //                     console.log(err)
    //             });
    //             callback(null,{
    //                 selectTopicsSuccess:false,
    //                 select_topics: false,
    //                 isTopicSelected: false,
    //                 topics: []
    //             })
    //         } else {
    users.findOneAndUpdate({ _id: msg.body.userid }, { $push: { topics_followed: { $each: msg.body.topics } } }, function (err, result) {
        if (err) {
            console.log(err)
            // mysqlconnection.rollback(function(err) {
            //     if(err)
            //         console.log(err)
            // });
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
            // mysqlconnection.commit(function(err) {
            //     if (err) { 
            //         mysqlconnection.rollback(function(err) {
            //             if(err)
            //                 console.log(err)
            //         });
            //     }
            // });
        }
    })
    //         }
    //     })
    // })
}
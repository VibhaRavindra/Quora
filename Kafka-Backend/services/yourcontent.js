var async = require('async');
var Users = require('../models/UserSchema');
var Answers = require('../models/AnswerSchema');
var Notifications = require('../models/NotificationSchema');
var Connection=require('../DatabaseConnection')
const {redisClient} = require('../redisClient')

exports.yourcontentService = function yourcontentService(msg, callback){
    console.log("In follow Service path:", msg.path);
    switch(msg.path){
            case "getquestionsasked":
            getquestionsasked(msg,callback);
            break;
            case "getquestionsfollowed" :
            getquestionsfollowed(msg,callback);
            break;
            case "getuseranswers":
            getuseranswers(msg,callback);
            break;
    }
};


function getquestionsasked(msg, callback){
    console.log("test1");
    
    Users.users.findOne({_id:msg.body.userid},{questions_asked:1,_id:0}, function(err,results){
        if (err) {
            console.log("unable to read the database questions");
        } else  
            if (results) {
                console.log(results);
                callback(null, { status: 200, questions: results.questions_asked });
            }
            else {
                callback(null, { status: 204, questions: "no data found" });
            }               
                  
    })   
}

function getquestionsfollowed(msg, callback) {

    
    console.log("test2");
    Users.users.findOne({ _id:msg.body.user_id},{questions_followed:1,_id:0}, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                callback(null, { status: 200, questions: results.questions_followed });
            }
            else {
                callback(null, { status: 204, questions: "no data found" });
            }
        }
    })
}
function getuseranswers(msg, callback) {

    
    console.log("test3");
    Users.answers_answered.findOne({ _id:msg.body.owner_name},{useranswers:1,_id:0}, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                callback(null, { status: 200, questions: results.answers });
            }
            else {
                callback(null, { status: 204, questions: "no data found" });
            }
        }
    })
}
  






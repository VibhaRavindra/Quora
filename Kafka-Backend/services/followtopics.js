var async = require('async');

var Questions = require('../models/QuestionSchema');



exports.followService = function followService(msg, callback){
    console.log("In Property Service path:", msg.path);
    switch(msg.path){
        case "followquestion":
        followquestion(msg,callback);
            break;
            
    
    }
};



function followquestion(msg, callback){

    console.log("In listing property topic service. Msg: ", msg)
  Questions.questions.update( {"_id":msg.body.qid},{$push:{followers:msg.body.follower_username}}, function (error,result) {
        if (error) {
            console.log(error.message)
            callback(null, {status:400,error});
        } else {
           
            callback(null, {status: 200, result});
        }
    })
   
}
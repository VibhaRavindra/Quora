var async = require('async');
var Users = require('../models/UserSchema');
var Questions = require('../models/QuestionSchema');
var Notifications = require('../models/NotificationSchema');
var Connection=require('../DatabaseConnection')


exports.followService = function followService(msg, callback){
    console.log("In follow Service path:", msg.path);
    switch(msg.path){
       
            case "followquestion":
            followquestion(msg,callback);
            break;
            case "getnotifications":
            getnotifications(msg,callback);
            break;
            case "followtopic":
            followtopic(msg,callback);
            break;
            
    
    }
};

function getnotifications(msg, callback){
    let questionsfollowed=[];
    Questions.questions.find({followers:msg.body.user_name},{"_id":1}, function(err,result){
        if (err) {
            console.log("unable to read the database questions");
        } else {  for(i in result){
                           questionsfollowed.push(result[i]._id)
                      }
                      console.log(questionsfollowed) 
                      Notifications.notifications.find( {qid:{$in:questionsfollowed}} , function(err,result){
                        if (err) {
                            console.log(err);
                            console.log("unable to read the database");
                            callback(err, "unable to read the database");
                        } else 
                                   { console.log("yippeee got notification",result)
                                       callback(null, {status: 200, result});}
                                
                    })
                 
           }
                
    })

    
   
}

function followquestion(msg, callback){

    console.log("In listing property topic service. Msg: ", msg)

  Questions.questions.update( {"_id":msg.body.qid},{$push:{answers:msg.body.answers}},function (error,result) {
        if (error) {
            console.log(error.message)
            callback(null, {status:400,error});
        } else {
                  
            callback(null, {status: 200, result});
        }
    })
   
}
function followtopic(msg, callback){

    console.log("In listing property topic service. Msg: ", msg)

  Users.users.update( {"user_name":msg.body.username},{$push:{followers:msg.body.topicname}}, function (error,result) {
        if (error) {
            console.log(error.message)
            callback(null, {status:400,error});
        } else {
           
            callback(null, {status: 200, result});
        }
    })
   
}

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
            case "followuser":
            followuser(msg,callback);
            break;
            case "getusersquestions":
            getusersquestions(msg,callback);
            break;
            case "unfollowuser":
            unfollowuser(msg,callback);
            break;
            case "unfollowquestion":
            unfollowquestion(msg,callback);
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

  Questions.questions.update( {"_id":msg.body.qid},{$push:{followers:msg.body.follower_username}},function (error,result) {
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

  Users.users.update( {"user_name":msg.body.username},{$push:{topics_followed:msg.body.topicname}}, function (error,result) {
        if (error) {
            console.log(error.message)
            callback(null, {status:400,error});
        } else {
           
            callback(null, {status: 200, result});
        }
    })
   
}

function followuser(msg, callback){


  Users.users.update( {"user_name":msg.body.user_name},{$push:{users_followers:msg.body.follow_user_name}}, function (error,result) {
        if (error) {
            console.log(error.message)
            callback(null, {status:400,error});
        } else {
           
            callback(null, {status: 200, result});
        }
    })
   
}


function getusersquestions(msg, callback){
    let usersfollowed=[];
    Users.users.find({user_name:msg.body.user_name},{"users_followers":1,"_id":0}, function(err,result){
        if (err) {
            console.log("unable to read the database questions");
        } else { 
                      console.log(result[0].users_followers)
                      usersfollowed=result[0].users_followers
                      Users.users.find( {user_name:{$in:usersfollowed}} , function(err,result){
                        if (err) {
                            console.log(err);
                            console.log("unable to read the database");
                            callback(err, "unable to read the database");
                        } else 
                                   { let sendingresults=[];
                                    for(i in result)   {
                                       
                                    console.log("yippeee got notification",result[i].questions_asked[0].question)
                                    var data={
                                        "question":result[i].questions_asked[0].question,
                                        "answer":result[i].questions_asked[0].answers[0].answer,
                                        "askedby":result[i].user_name,
                                        "askedby_name":result[i].firstname+result[i].lastname,
                                        "askedby_tagline":result[i].user_tagline,
                                        "askedby_profile_pic":result[i].user_profile_pic,
                                    }
                                      sendingresults.push(data)
                                }
                            console.log(sendingresults)
                            result=sendingresults
                                      
            callback(null, {status: 200, result});
                            }
                                
                    })
                      
               
                 
           }
                
    })   
}

function unfollowuser(msg, callback){


    Users.users.update( {"user_name":msg.body.user_name},{$pull:{users_followers:msg.body.unfollow_user_name}}, function (error,result) {
          if (error) {
              console.log(error.message)
              callback(null, {status:400,error});
          } else {
             
              callback(null, {status: 200, result});
          }
      })
     
  }

  function unfollowquestion(msg, callback){

    console.log("In listing property topic service. Msg: ", msg)

  Questions.questions.update( {"_id":msg.body.qid},{$pull:{followers:msg.body.follower_username}},function (error,result) {
        if (error) {
            console.log(error.message)
            callback(null, {status:400,error});
        } else {
                  
            callback(null, {status: 200, result});
        }
    })
   
}




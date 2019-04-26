var async = require('async');
var Users = require('../models/UserSchema');
var Connection=require('../DatabaseConnection')
const {redisClient} = require('../redisClient')

exports.profileService = function profileService(msg, callback){
    console.log("In follow Service path:", msg.path);
    switch(msg.path){
       
            case "addtagline":
            addtagline(msg,callback);
            break;
            case "addemployment":
            addemployment(msg,callback);
            break;
            case "addeducation":
            addeducation(msg,callback);
            break;
            case "addprofilepic":
            addprofilepic(msg,callback);
            break;
            case "getprofileinfo":
            getprofileinfo(msg,callback);
            break;
            case "getfollowersinfo":
            getfollowersinfo(msg,callback);
            break;
            case "getfollowinginfo":
            getfollowinginfo(msg,callback);
            break;
            case "addlocation":
            addlocation(msg,callback);
            break;
            
    
    }
};

function addtagline(msg, callback){

    console.log("In listing property topic service. Msg: ", msg)
console.log(msg.body)
  Users.users.update( {"user_name":msg.body.user_name},{$set: { "user_tagline" : msg.body.tagline}}, function (error,result) {
        if (error) {
            console.log(error.message)
            callback(null, {status:400,error});
        } else {
            redisClient.del("applicantProfile_" + msg.body.user_name);
            callback(null, {status: 200, result});
        }
    })
   
}
function addemployment(msg, callback){

    console.log("In listing property topic service. Msg: ", msg)
console.log(msg.body)
  Users.users.update( {"user_name":msg.body.user_name},{$set: { "career" : msg.body.career}}, function (error,result) {
        if (error) {
            console.log(error.message)
            callback(null, {status:400,error});
        } else {
            redisClient.del("applicantProfile_" + msg.body.user_name);
            callback(null, {status: 200, result});
        }
    })
   
}
function addeducation(msg, callback){

    console.log("In listing property topic service. Msg: ", msg)
console.log(msg.body)
  Users.users.update( {"user_name":msg.body.user_name},{$set: { "education" : msg.body.education}}, function (error,result) {
        if (error) {
            console.log(error.message)
            callback(null, {status:400,error});
        } else {
            redisClient.del("applicantProfile_" + msg.body.user_name);
            callback(null, {status: 200, result});
        }
    })
   
}
function addlocation(msg, callback){

    console.log("In listing property topic service. Msg: ", msg)
console.log(msg.body)
  Users.users.update( {"user_name":msg.body.user_name},{$set: { "zipcode" : msg.body.zipcode ,"state":msg.body.state}}, function (error,result) {
        if (error) {
            console.log(error.message)
            callback(null, {status:400,error});
        } else {
            redisClient.del("applicantProfile_" + msg.body.user_name);
            callback(null, {status: 200, result});
        }
    })
   
}


function addprofilepic(msg, callback){

    console.log("In listing property topic service. Msg: ", msg)

 
   
}

function getfollowersinfo(msg, callback){

                      Users.users.find( {user_name:{$in:msg.body.followers}} ,{"_id":0,"firstname":1,"lastname":1,"user_tagline":1,"user_profile_pic":1}, function(err,result){
                        if (err) {
                            console.log(err);
                            console.log("unable to read the database");
                            callback(err, "unable to read the database");
                        } else 
                                   { 
            callback(null, {status: 200, result});
                            }
                                
                    })
   
}


function getfollowinginfo(msg, callback){

    Users.users.find( {user_name:{$in:msg.body.following}} ,{"_id":0,"firstname":1,"lastname":1,"user_tagline":1,"user_profile_pic":1}, function(err,result){
      if (err) {
          console.log(err);
          console.log("unable to read the database");
          callback(err, "unable to read the database");
      } else 
                 { 
callback(null, {status: 200, result});
          }
              
  })

}

function getprofileinfo(msg, callback){
    let result = {};
    try {
        let redisKey = "applicantProfile_" + msg.body.user_name;
        redisClient.get(redisKey, async function (err, profile) {
            if (!err && profile != null) {
                console.log("Get applicant profile : profile found in cache");
                profile = JSON.parse(profile);
                result=profile;
            } else {
                console.log("Get applicant profile : inserting profile into cache");
                profile = await Users.users.findOne( { user_name: msg.body.user_name },{"_id":0,"firstname":1,"lastname":"1","user_tagline":1,"user_profile_pic":1,"career":1,"education":1,"users_followers":1,"users_following":1,"zipcode":1,"state":1});
                if (profile) {
                    redisClient.set(redisKey, JSON.stringify(profile), function (error, reply) {
                        if (error) {
                            console.log(error);
                        }
                        console.log(reply);
                    });
                    //cache will expire in 30 secs
                    result=profile;
                    redisClient.expire(redisKey, 30);
                }
            }
           
            callback(null, {status: 200, result});
        });
    }
    catch (error) {
        console.log("Something went wrong while inserting profile! : ", error);
        //don't let time out occur, send internal server error
     
        callback(null, {status:400,error});
    }
   
}




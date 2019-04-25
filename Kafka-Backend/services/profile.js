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
            case "addprofilepic":
            addprofilepic(msg,callback);
            break;
            case "getprofileinfo":
            getprofileinfo(msg,callback);
            break;
            
    
    }
};

function addtagline(msg, callback){

    console.log("In listing property topic service. Msg: ", msg)

  Users.users.update( {"user_name":msg.body.user_name},{"owner_tagline":msg.body.tagline}, function (error,result) {
        if (error) {
            console.log(error.message)
            callback(null, {status:400,error});
        } else {
           
            callback(null, {status: 200, result});
        }
    })
   
}

function addprofilepic(msg, callback){

    console.log("In listing property topic service. Msg: ", msg)

  Users.users.update( {"user_name":msg.body.user_name},{"owner_profile_pic":msg.body.owner_profile_pic}, function (error,result) {
        if (error) {
            console.log(error.message)
            callback(null, {status:400,error});
        } else {
           
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
            } else {
                console.log("Get applicant profile : inserting profile into cache");
                profile = await Users.users.findOne( { user_name: msg.body.user_name },{"_id":0,"firstname":1,"lastname":"1","user_tagline":1,"user_profile_pic":1});
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




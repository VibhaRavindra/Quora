var {users} = require('../models/UserSchema');
var {questions} = require('../models/QuestionSchema');
var {topics} = require('../models/TopicSchema');

exports.followService = function followService(msg, callback){
    console.log("Inside kafka backend search.js");
    console.log("msg", msg);
    console.log("In Property Service path:", msg.path);
    switch(msg.path){
        case "topics":
            topics_function(msg,callback);
            break;
        case "profiles":
            profiles(msg,callback);
            break;
        case "questions":
            questions_search(msg,callback);
            break;
    }
};

function profiles(msg, callback){
    users.find({ $text: { $search: msg.body.searchText}, status:"Activated"}, 
        { score: { $meta: "textScore" }, user_name:1,firstname:1, lastname:1, user_tagline:1, user_profile_pic:1, users_followers:1, career:1, aboutme:1 })
    .sort({ score : { $meta : 'textScore' } })
    .exec(function(err, results) {
        let profiles_array = []
        if(err) {
            console.log(err)
            callback(null, {
                searchSuccess: false,
                profiles_array: profiles_array
            })
        } else {
            let num_of_followers;
            results.forEach((result)=>{
                num_of_followers = result.users_followers.length;
                profiles_array.push({
                    profile_id: result._id,
                    user_name: result.user_name,
                    firstname: result.firstname,
                    lastname: result.lastname,
                    career: result.career,
                    aboutme: result.aboutme,
                    user_tagline: result.user_tagline,
                    num_of_followers: num_of_followers,
                    profile_image: result.user_profile_pic,
                    followers:result.users_followers
                })
            })
            callback(null, {
                searchSuccess: true,
                profiles_array: profiles_array
            });
        }
    });
}

function questions_search(msg, callback){
    questions.find({ $text: { $search: msg.body.searchText}}, 
        { score: { $meta: "textScore" }, question:1,followers:1 })
    .sort({ score : { $meta : 'textScore' } })
    .exec(function(err, results) {
        let questions_array = []
        if(err) {
            console.log(err)
            callback(null, {
                searchSuccess: false,
                questions_array: questions_array
            })
        } else {
            let num_of_followers;
            results.forEach((result)=>{
                num_of_followers = result.followers.length;
                questions_array.push({
                    questionid: result._id,
                    question: result.question,
                    num_of_followers: num_of_followers,
                    followers:result.followers
                })
            })
            callback(null, {
                searchSuccess: true,
                questions_array: questions_array
            });
        }
    });
}

function topics_function(msg, callback){
    topics.find({ $text: { $search: msg.body.searchText}}, 
        { score: { $meta: "textScore" }})
    .sort({ score : { $meta : 'textScore' } })
    .exec(function(err, results) {
        let topics_array = []
        if (err){
            console.log(err)
            callback(null, {
                searchSuccess: false,
                topics_array: topics_array
            })
        } else {
            results.forEach((result)=>{
                topics_array.push({
                    topic_id : result._id,
                    name: result.name,
                    num_of_followers: result.num_of_followers
                })
            })
            callback(null, {
                searchSuccess: true,
                topics_array: topics_array
            });
        }
    })
}

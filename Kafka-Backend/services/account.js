const bcrypt = require('bcrypt');
const saltRounds = 2;
var {users} = require('../models/UserSchema');
const mysql = require('mysql');
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

exports.followService = function followService(msg, callback){
    console.log("Inside kafka backend account.js");
    // console.log("msg"+ msg);
    console.log("msg", msg);
    console.log("In Property Service path:", msg.path);
    switch(msg.path){
        case "signup":
            signup(msg,callback);
            break;
        case "signin":
            signin(msg,callback);
            break;
        case "selectedTopics":
            selectedTopics(msg,callback);
            break;
    }
};

function signup(msg, callback){
    console.log("Inside Kafka Backend signup and msg = ",msg);
    let hashpw;
    bcrypt.hash(msg.body.password, saltRounds, function(err, hash) {
        if(err){
            console.log(err)
        }
        hashpw = hash;
    });
    let newUser = new users({user_name:msg.body.user_name, firstname:msg.body.firstname, lastname:msg.body.lastname})
    let mongo_userid = String(newUser._id);
    mysqlconnection.beginTransaction(function(err) {
        if (err) { 
            console.log("INSIDE ERROR 1")
            callback(null,{
                signupSuccess:false,
                signupMessage:"Sign Up Failed"
            })
            // throw err; 
        }
        const signUpQuery = "INSERT INTO Users(user_name,firstname,lastname, password, mongo_userid) VALUES(?,?,?,?,?)"
        mysqlconnection.query(signUpQuery,[msg.body.user_name,msg.body.firstname,msg.body.lastname,hashpw,mongo_userid],(err,result)=>{
            if(err){
                console.log(err)
                console.log("INSIDE ERROR 2")
                mysqlconnection.rollback(function() {
                    // throw err;
                });
                callback(null,{
                    signupSuccess:false,
                    signupMessage:"User already Exists!"
                })
            } else {
                newUser.save(function (err, result) {
                    if (err) {
                        console.log("err newUser save")
                        mysqlconnection.rollback(function() {
                            // throw err;
                        });
                        callback(null,{
                            signupSuccess:false,
                            signupMessage:"Sign Up Failed"
                        })
                    }else{
                        mysqlconnection.commit(function(err) {
                            if (err) { 
                                mysqlconnection.rollback(function() {
                                // throw err;
                                });
                            }
                        });
                        callback(null,{
                            signupSuccess:true,
                            signupMessage:"Sign Up Success. Sign In to continue!"
                        })
                    }
                })
            }
        })
    })
}

function signin(msg, callback){
    mysqlconnection.query('SELECT * FROM Users WHERE user_name=?',[msg.body.user_name], 
    function(err, rowsOfTable, fieldsOfTable){ 
        if(err){
            callback(null,{
                signinSuccess:false,
                signinMessage:"Sign In Failed"
            })
        }
        var UserArray = [];
        if(rowsOfTable.length == 1){
            var result = bcrypt.compareSync(msg.body.password, rowsOfTable[0].password);
            if(result){
                console.log("SIGNIN SUCCESS")
                console.log(rowsOfTable[0].firstname)
                console.log(rowsOfTable[0].lastname)
                console.log(rowsOfTable[0].mongo_userid)
                console.log(rowsOfTable[0].select_topics)
                callback(null,{
                    signinSuccess:true,
                    user_name: rowsOfTable[0].user_name,
                    firstname: rowsOfTable[0].firstname,
                    lastname: rowsOfTable[0].lastname,
                    userid: rowsOfTable[0].mongo_userid,
                    select_topics: rowsOfTable[0].select_topics
                });
            } else{
                callback(null,{
                    signinSuccess:false,
                    signinMessage:"Password Incorrect!"
                })
            }
        } else {
            callback(null,{
                signinSuccess:false,
                signinMessage:"User does not Exist!"
            })
        }
    })
}

function selectedTopics(msg, callback){
    mysqlconnection.beginTransaction(function(err) {
        if (err) { 
            callback(null,{
                selectTopicsSuccess:false
            })
        }
        console.log("msg.body.user_name ",msg.body.user_name)
        const query = "UPDATE Users SET select_topics = ? WHERE user_name = ?"
        mysqlconnection.query(query,[1,msg.body.user_name],(err,result)=>{
            if(err){
                console.log(err)
                mysqlconnection.rollback(function() {});
                callback(null,{
                    selectTopicsSuccess:false,
                    select_topics: false
                })
            } else {
                users.findOneAndUpdate({_id:msg.body.userid}, { $push: { topics_followed: { $each: msg.body.topics }}}, function(err, result){
                    if (err){
                        console.log(err)
                        mysqlconnection.rollback(function() {});
                        callback(null,{
                            selectTopicsSuccess:false,
                            select_topics: false
                        })
                    } else {
                        mysqlconnection.commit(function(err) {
                            if (err) { 
                                mysqlconnection.rollback(function() {
                                });
                            }
                        });
                        callback(null,{
                            selectTopicsSuccess:true,
                            select_topics: true
                        })
                    }
                })
            }
        })
    })
}
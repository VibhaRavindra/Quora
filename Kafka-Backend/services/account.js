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
    }
};

function signup(msg, callback){
    console.log(msg);
    let hashpw;
    bcrypt.hash(msg.body.password, saltRounds, function(err, hash) {
        if(err){
            console.log(err)
        }
        hashpw = hash;
    });
    mysqlconnection.beginTransaction(function(err) {
        if (err) { 
            callback(null,{
                signupSuccess:false,
                signupMessage:"Sign Up Failed"
            })
            throw err; 
        }
        const signUpQuery = "INSERT INTO Users(user_name,firstname,lastname, password) VALUES(?,?,?,?)"
        mysqlconnection.query(signUpQuery,[msg.body.user_name,msg.body.firstname,msg.body.lastname,hashpw],(err,result)=>{
            if(err.code == "ER_DUP_ENTRY"){
                console.log(err)
                callback(null,{
                    signupSuccess:false,
                    signupMessage:"User Already Exists"
                })
            } else if(err){
                console.log(err)
                callback(null,{
                    signupSuccess:false,
                    signupMessage:"Sign Up Failed"
                })
            } else {
                users.findOne({user_name:msg.body.user_name}, function(err, findUser){
                    if (err) {
                        console.log("err UserModel.findOne")
                        mysqlconnection.rollback(function() {
                            throw err;
                        });
                        callback(null,{
                            signupSuccess:false,
                            signupMessage:"Sign Up Failed"
                        })
                    }
                    if(findUser == null){
                        var newUser = new users({ 
                            user_name: msg.body.user_name, 
                            firstname: msg.body.firstname, 
                            lastname: msg.body.lastname,
                            password: hashpw
                        });
                        newUser.save(function (err, result) {
                            if (err) {
                                mysqlconnection.rollback(function() {
                                    throw err;
                                });
                                console.log("err newUser save")
                                callback(null,{
                                    signupSuccess:false,
                                    signupMessage:"Sign Up Failed"
                                })
                            }else{
                                console.log("all done")
                                mysqlconnection.commit(function(err) {
                                    if (err) { 
                                        mysqlconnection.rollback(function() {
                                        throw err;
                                        });
                                    }
                                });
                                callback(null,{
                                    signupSuccess:true,
                                    signupMessage:"Sign Up Success. Sign In to continue!"
                                })
                            }
                        });     
                    }else{
                        mysqlconnection.rollback(function() {
                            throw err;
                        });
                        console.log("User already exists")
                        callback(null,{
                            signupSuccess:false,
                            signupMessage:"User Already Exists"
                        })
                    }
                }) 
            }
        })
    })
}
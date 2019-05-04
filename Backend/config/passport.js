'use strict';
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
// var kafka = require('./kafka/client');
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

// Setup work and export for the JWT passport strategy
module.exports = function(passport) {
    console.log("in passport function...")
var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "cmpe273"
};
passport.use(new JwtStrategy(opts, function(jwt_payload, callback) {
    console.log("JWT Payload:", jwt_payload);
    //redis key = requireAuth_ + jwt_payload.user_name
    // If it is in redis, return. 
    // Else, 1. go to MYSQL 2. insert into redis, 3. return
    mysqlconnection.query("SELECT user_name from Users WHERE user_name=? AND active=1", [jwt_payload.user_name], function(err, rowsOfTable){
        if(err || rowsOfTable.length != 1) {
            console.log(err);
            console.log("UnAuthorized User")
            callback("Not valid token", false)
        } else {
            console.log("user is authorized")
            callback(null, jwt_payload);
        }
    })
    // // Add code to check in MYSQL if user_name is existing & active.
    // kafka.make_request('account', {"path":"isvalidAccount", body}, function(err,result){
    //     if (err){
    //         console.log("Error")
    //         console.log(err)
    //         callback("Not valid token", false)
    //     }else{
    //         if(result.isValid) {
    //             console.log("user is authorized")
    //             callback(null, jwt_payload);
    //         } else {
    //             console.log("UnAuthorized User")
    //             callback("Not valid token", false)
    //         }
            
    //     }
    // });
}));
}
    
const redis = require('redis');
let redisClient = null;
redisClient = redis.createClient(6379, '127.0.0.1');
redisClient.on('connect', function (err) {
    if(err){
        console.log("Error occured while connecting to redis server")
    }else{
    console.log('connected to Redis...');
    }
});
module.exports = {
    redisClient
};
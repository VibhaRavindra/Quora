var connection = new require('./kafka/Connection');

//topics file
var account = require('./services/account.js');
var followtopics = require('./services/followtopics.js');
var profile = require('./services/profile.js');
var questiontopics = require('./services/questiontopics');
var answer = require('./services/answer.js');
var search = require('./services/search.js');
var yourcontent = require('./services/yourcontent.js');
var messagetopics = require('./services/messagetopics');
var bookmarks = require('./services/bookmarks.js');
var graphtopics = require('./services/graphtopics');

// Set up Database connection
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://kavya:kavya@cluster0-33gdb.mongodb.net/test?retryWrites=true', { useNewUrlParser: true, poolSize: 10 }, function (err) {
    if (err) {
        console.log("ERROR! MONGO MONGOOSE")
        throw err;
    }
    else {
        console.log('Successfully connected to MongoDB');
    }
})

console.log('Kafka server is running ');

function handleTopicRequest(topic_name, fname) {
    console.log("topic_name:", topic_name)
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    consumer.on('error', function (err) {
        console.log("Kafka Error: Consumer - " + err);
    });
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name + " ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        switch (topic_name) {
            case 'follow_topics':
                followtopics.followService(data.data, function (err, res) {
                    response(data, res, producer);
                    return;
                })
                break;
            case 'account':
                account.followService(data.data, function (err, res) {
                    response(data, res, producer);
                    return;
                })
                break;
            case 'search':
                search.followService(data.data, function (err, res) {
                    response(data, res, producer);
                    return;
                })
                break;
            case 'profile':
                profile.profileService(data.data, function (err, res) {
                    response(data, res, producer);
                    return;
                })
                break;
            case 'answer':
                answer.answerService(data.data, function (err, res) {
                    response(data, res, producer);
                    return;
                })
                break;
            case 'question_topics' :
                questiontopics.questionService(data.data, function(err, res){
                        response(data, res, producer);
                        return;
                    })
                    break;
            case 'message_topics':
                    messagetopics.messageService(data.data, function(err, res){
                    response(data, res, producer);
                    return;
                })
                break;
            case 'yourcontent' :
                yourcontent.followService(data.data, function(err, res){
                        response(data, res, producer);
                        return;
                })
            break;
            case 'bookmarks':
                bookmarks.bookmarksService(data.data, function (err, res) {
                    response(data, res, producer);
                    return;
                })
                break;
            case 'graph_topics':
                graphtopics.graphService(data.data, function(err, res){
                response(data, res, producer);
                return;
            })
            break;
        }
    })
};

function response(data, res, producer) {
    console.log('after handle', res);
    var payloads = [
        {
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }
    ];
    producer.send(payloads, function (err, data) {
        console.log('producer send', data);
    });
    return;
}

// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("account", account)
handleTopicRequest("follow_topics", followtopics);
handleTopicRequest("profile", profile)
handleTopicRequest("answer", answer);
handleTopicRequest("search", search);
handleTopicRequest("bookmarks", bookmarks);
handleTopicRequest("question_topics", questiontopics);
handleTopicRequest("yourcontent", yourcontent);
handleTopicRequest("message_topics", messagetopics);
handleTopicRequest("graph_topics", graphtopics);
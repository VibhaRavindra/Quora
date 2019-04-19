var connection =  new require('./kafka/Connection');

//topics file
var followtopics = require('./services/followtopics.js');


// Set up Database connection

const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://kavya:kavya@cluster0-33gdb.mongodb.net/test?retryWrites=true',{ useNewUrlParser: true , poolSize: 10 }, function(err) {
  if (err) throw err;
  else {
      console.log('Successfully connected to MongoDB');
  }
})

console.log('Kafka server is running ');

function handleTopicRequest(topic_name, fname){
    console.log("topic_name:", topic_name)
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    consumer.on('error', function (err) {
        console.log("Kafka Error: Consumer - " + err);
    });
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        switch (topic_name) {

        case 'follow_topics' :
        followtopics.followService(data.data, function(err, res){
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
        { topic: data.replyTo,
            messages:JSON.stringify({
                correlationId:data.correlationId,
                data : res
            }),
            partition : 0
        }
    ];
    producer.send(payloads, function(err, data){
        console.log('producer send', data);
    });
    return;
}

// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("follow_topics",followtopics);

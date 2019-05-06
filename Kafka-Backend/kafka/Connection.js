var kafka = require('kafka-node');
let brokers = "18.144.17.51:2181,54.183.184.164:2181,18.144.47.158:2181";

function ConnectionProvider() {
    this.getConsumer = function(topic_name) {
        //if (!this.kafkaConsumerConnection) {
            this.client = new kafka.Client(brokers);
            this.kafkaConsumerConnection = new kafka.Consumer(this.client,[ { topic: topic_name, partition: 0, groupId : "KafkaBackend"}]);
            this.client.on('ready', function () { console.log('Topic Consumer is ready for topic:', topic_name) })
        //}
        return this.kafkaConsumerConnection;
    };

    //Code will be executed when we start Producer
    this.getProducer = function() {

        if (!this.kafkaProducerConnection) {
            this.client = new kafka.Client(brokers);
            var HighLevelProducer = kafka.HighLevelProducer;
            this.kafkaProducerConnection = new HighLevelProducer(this.client);
            console.log('Response Producer is ready!');
        }
        return this.kafkaProducerConnection;
    };
}
exports = module.exports = new ConnectionProvider;
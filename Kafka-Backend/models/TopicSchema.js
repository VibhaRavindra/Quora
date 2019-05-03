var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const TopicSchema = new Schema({
    name:{
        type: String,
        default: '', 
    },
    num_of_followers: {
        type: Number,
        default: 0
    }
});

const topics=mongoose.model("Topics",TopicSchema)
module.exports = {topics};

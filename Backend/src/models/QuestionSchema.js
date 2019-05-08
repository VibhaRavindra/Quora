var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Answer = require('./AnswerSchema');
//schema
const QuestionSchema = new Schema({
    question: {
        type: String,
        default: '',
        required: true
    },
    topic_name: {
        type: String
    },
    owner_username: {
        type: String,
        required: true
    },
    owner_name: {
        type: String,
        required: true
    },
    owner_tagline: {
        type: String
    },
    owner_profile_pic: {
        type: String
    },
    followers: {
        type: Array,
        default: [] 
    },
    answers: {
        type: [Answer.AnswerSchema],
        default: [] 
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
});
const questions=mongoose.model("Question",QuestionSchema)
module.exports = {QuestionSchema,questions};

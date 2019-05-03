var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AnswerViewSchema = new Schema({
    id: {
        type: String,
        required: true
      },
    answer: {
      type: String,
      required: true
    },
    owner_username: {
        type: String,
        required: true
    },
    count:{
        type:Number,
        default:0
    },
    peopleviewed:{
      type: Array,
     
    }
    
  })
  const Answerviews=mongoose.model('Answerviews', AnswerViewSchema)
  module.exports = {Answerviews,AnswerViewSchema};

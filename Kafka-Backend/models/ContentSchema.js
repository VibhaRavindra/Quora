var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Question = require('./QuestionSchema');
var Answer= require('./AnswerSchema');
const ContentSchema=new Schema({
user_name:{
     type:String,
     required:true
},
questions_asked:{
     type:[Question.QuestionSchema],
     required:true
  },
questions_followed:{
     type:[Question.QuestionSchema],
     required:true
},
answers_answered:{
     type:[Answer.AnswerSchema],
     required:true
},
})
var contents=mongoose.model('Contents', ContentSchema)
module.exports = {contents,ContentSchema};

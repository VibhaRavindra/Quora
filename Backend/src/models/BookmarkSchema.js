var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Question = require('./QuestionSchema');
const BookmarkSchema = new Schema({
    question: {
    type: [Question.QuestionSchema],
    default:[]
    }
  })
  var bookmarks=mongoose.model('Bookmarks', BookmarkSchema)
  module.exports = {bookmarks,BookmarkSchema};
  
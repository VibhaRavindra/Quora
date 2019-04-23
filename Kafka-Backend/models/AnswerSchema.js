var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Comment = require('./CommentSchema');
const AnswerSchema = new Schema({
    answer: {
      type: String,
      required: true
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
        type: String,
        required: true
    },
    owner_profile_pic: {
        type: String,
        required: true
    },
     is_anonymous: {
       type: Boolean,
       default:false
     },
     upvotes: [ new Schema({ 
       username: {
         type: 'string'
       } 
     })
     ],
     downvotes: [ new Schema({
       username: {
        type: 'string' 
       } 
     })
     ],
     upvote_count: {
       type: Number
     },
     downvote_count: {
        type: Number
      },
     timestamp: {
       type: Date, 
         default: Date.now,
         required: true
     },
     answer_images: {
      type: Array,
      default:[]
     },
     comments: {
      type: [Comment.CommentSchema],
      default: []
     }
  })
  const answers=mongoose.model('Answers', AnswerSchema)
  module.exports = {answers,AnswerSchema};

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Comment = require('./CommentSchema');
const AnswerSchema = new Schema({
    answer: {
      type: String,
      required: true
    },
    question_id: {
      type: String,
      required: true
    },
    owner_username: {
        type: String,
        required: true
    },
    owner_userid: {
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
        type: String,
    },
     is_anonymous: {
       type: Boolean,
       default:false
     },
     upvotes: [ String ],
     downvotes: [ String ],
     upvote_count: {
       type: Number
     },
     downvote_count: {
        type: Number
      },
      bookmarked_by: [ String ],
      timestamp: {
       type: Date, 
         default: Date.now,
         required: true
     },
     comments: {
      type: [Comment.CommentSchema],
      default: []
     }
  })
  const answers=mongoose.model('Answers', AnswerSchema)
  module.exports = {answers,AnswerSchema};

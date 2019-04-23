var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const CommentSchema = new Schema({
  comment: {
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
   timestamp: {
     type: Date, 
       default: Date.now,
       required: true
   }
})

const comments=mongoose.model('Comments', CommentSchema)
module.exports = {comments,CommentSchema};

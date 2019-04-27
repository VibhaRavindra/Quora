var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Question = require('./QuestionSchema');
var Answer= require('./AnswerSchema');
var Bookmark= require('./BookmarkSchema');
//schema
const UserSchema = new Schema({
  user_name: {
    type: String,
    required: true,
    unique: true,
    sparse: true 
  },
  user_tagline: {
    type: String,
    default:""
  },
  user_profile_pic:{
      type: String
  },
  b64:{
    type: String
},
  firstname: {
    type: String,
    required: true,
    default:""
  },
  lastname:{
    type: String,
    required: true
  },
  city: {
    type: String  
  },
  state:{
      type: String
  },
  zipcode: {
  type: String,
    validate: {
      validator: function(v) {
        return /^[0-9]{5}(?:-[0-9]{4})?$/.test(v);
      },
      message: props => `${props.value} is not a valid zipcode number!`
    }
  },
  education:{
    type: String,
    default:""
  },
  career: {
    type: String,
    default:""
  },
  aboutme:{
    type: String
  },
  users_followers:{
    type: Array
  },
  users_following:{
    type:Array 
  },
  topics_followed:{
    type:Array
  },
  answers_answered:{
    type: [Answer.AnswerSchema] 
  },
  questions_asked:{
    type: [Question.QuestionSchema]    
  },
  bookmarks:{
    type:[Bookmark.BookmarkSchema],
  },
  profileview_count:{
    type: Number,
  },
  status:{
    type:String,
    default:"Activated"
  },
questions_followed:{
    type:[Question.QuestionSchema],
    required:true
},
});
    
var users=mongoose.model('Users',UserSchema)
module.exports = {users,UserSchema};



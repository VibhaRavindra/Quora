var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Question = require('./QuestionSchema');
var Answer= require('./AnswerSchema');
var Bookmark= require('./BookmarkSchema');
//schema
const UserSchema = new Schema({

user_name: {
    type: String,
  required: true
},
user_tagline: {
  type: String,
  required: true
},
user_profile_pic:{
    type: String,
    required:true
},
firstname: {
  type: String,
  
},
lastname:{
    type: String,
  
},
city: {
  type: String,
  
},
state:{
    type: String,
  
},
zipcode: {
  type: String,
 
  validate: {
    validator: function(v) {
      return /^[0-9]{5}(?:-[0-9]{4})?$/.test(v);
    },
    message: props => `${props.value} is not a valid zipcode number!`
  },
  
},
education:{
    type: String,
   
},
career: {
  type: String,

},
aboutme:{
    type: String,
 
},
users_followers:{
    type: Number,
},
users_following:{
    type:Number, 
},
topics_followed:{
  type:Array,
},
answers_answered:{
    type: [Answer.AnswerSchema],    
},
questions_asked:{
    type: [Question.QuestionSchema],    
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
}

});
    
var users=mongoose.model('Users',UserSchema)
module.exports = {users,UserSchema};



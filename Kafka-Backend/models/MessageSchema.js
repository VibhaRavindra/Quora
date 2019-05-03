var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
MessageSchema = new Schema({
  to_user_name: {
    type: String,
	required: true
  },
  to_name: {
	type: String,
	required: true
  },
  from_user_name: {
    type: String,
    required: true
  },
 from_name:{
  type: String,
  required: true
},
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  }
});
    
module.exports = mongoose.model('Messages', MessageSchema); 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
MessageConversationSchema = new Schema({
    key: {
      type: String,
      required: true
    },
    latest_message:{
        type: Object,
        default: {},
        required: true,
        unique: true
    }
  });
      
  module.exports = mongoose.model('MessageConversation', MessageConversationSchema); 

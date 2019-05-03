var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//schema
const NotificationSchema = new Schema({
    qid:{
        type: String,
        default: '', 
    },
    question: {
        type: String,
        default: '',
        required: true
    },
    answeredby: {
        type: String,
        default: '',
        required: true
    },
    answeredby_tagline: {
        type: String,
        default: '',
        required: true
    },
    answeredby_profile_pic: {
        type: String,
        default: '',
       
    },
    timestamp_answer:{
        type:String,
        default:'',

    },
    state:{
        type: String,
        default: 'unread',
    }
});
const notifications=mongoose.model("Notification",NotificationSchema)
module.exports = {notifications};

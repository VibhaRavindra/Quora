
var Questions = require('./models/QuestionSchema');
var Notifications = require('./models/NotificationSchema');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://kavya:kavya@cluster0-33gdb.mongodb.net/test?retryWrites=true',{ useNewUrlParser: true , poolSize: 10 }, function(err) {
  if (err) throw err;
  else {
      console.log('Successfully connected to MongoDB');
      var filter = [
        {"$addFields": {
            "tmpfields":{
              "$objectToArray":"$updateDescription.updatedFields"}
           }}, 
           {"$match":{"tmpfields.k":{
                      "$regex":"answers"}}}];
    
    var options = { fullDocument: 'updateLookup' };
      
  //   Questions.questions.watch(filter,options).on('change', data => 
  //   {
  //            console.log("sending information to",data.fullDocument.followers.slice(-1).pop(),data.fullDocument.question)
  // console.log(data);
  // Notifications.notifications.create({qid:data.fullDocument._id,question:data.fullDocument.question,answeredby:data.fullDocument.answers.slice(-1).pop().owner_name,answeredby_tagline:data.fullDocument.answers.slice(-1).pop().owner_tagline,answeredby_profile_pic:data.fullDocument.answers.slice(-1).pop().owner_profile_pic,timestap_answer:data.fullDocument.followers.slice(-1).pop().timestamp,state:"unread"})
           
    
    
  //           });   
  }
})


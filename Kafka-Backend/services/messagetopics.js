var Messages = require('../models/MessageSchema');
var MessageConversation = require('../models/MessageConversationSchema');
var Users = require('../models/UserSchema');

exports.messageService = function messageService(msg, callback) {
    console.log("In message Service path:", msg.path);
    switch (msg.path) {
        case "message_emailList":
            getEmailList(msg, callback);
            break;
        case "save_new_message":
            saveMessage(msg, callback);
            break;
        case "message_conversationList":
            getConversationList(msg, callback);
            break;
        case "message_messageList":
             getMessages(msg, callback);
             break;
    }
}


function getEmailList(msg, callback) {
    console.log("In message get email list. Msg: ", msg);
    Users.users.find({ "status": { $ne: "Deactivated" } }, { "user_name": 1, "_id": 0 }, function (err, results) {
        if (err) {
            console.log(err);
            console.log("Email list not found");
            callback(err, "Email list not found");
        } else {
            if (results) {
                console.log("results:", results)
                callback(null, { status: 200, emailList: results });
            }
            else {
                console.log("No results found");
                callback(null, { status: 401 });
            }
        }
    });
}


function saveMessage(msg, callback) {

    console.log("In inbox save new msg service. Msg: ", msg);


    Users.users.findOne({ "user_name": msg.body.to }, { "firstname": 1, "lastname": 1 }, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, "Database Error");
        } else {
            if (results) {
                console.log(results);
                let to_name = results.firstname + " " + results.lastname;
                console.log(to_name);
                var msgData = {
                    "to_user_name": msg.body.to,
                    "from_user_name": msg.body.from,
                    "message": msg.body.message,
                    "timestamp": new Date(),
                    "from_name": msg.body.sent_from_name,
                    "to_name": to_name
                }
                //Save the message in database
                Messages.create(msgData, function (err, message) {
                    if (err) {
                        console.log("unable to insert into database", message);
                        console.log(err);
                        callback(err, "Database Error");
                    } else {
                        console.log("msg sent");
                        callback(null, { status: 200, message });
                    }
                });
                
                let keyArr = [];
                keyArr.push(msg.body.from);
                keyArr.push(msg.body.to);
                keyArr.sort();
                let key = keyArr[0]+"|"+keyArr[1];
                console.log("key", key);
                MessageConversation.findOne({"key": key},function (err, result) {
                    if (err) {
                        console.log("unable to insert into database", message);
                        console.log(err);
                        callback(err, "Database Error");
                    } else {
                        if(result){
                            MessageConversation.findOneAndUpdate({"key": key},{$set: { "latest_message" : msgData }},function (err, result) {
                                if(err){
                                    console.log("error while updating conversation document");
                                    callback(err, "Database Error");
                                }
                                else{
                                    console.log("successfully updated");
                                    callback(null, { status: 200 });
                                }
                            });
                        }
                        else{
                            MessageConversation.create({"key": key, "latest_message": msgData}, function (err, message) {
                                if (err) {
                                    console.log("unable to insert into database", message);
                                    console.log(err);
                                    callback(err, "Database Error");
                                } else {
                                    console.log("msg saved in conversation table");
                                    callback(null, { status: 200, message });
                                }
                            });
                        }
                    }
                });
            }
            else {
                callback(null, { status: 204, questions: "no data found" });
            }
        }
    });

}

function getConversationList(msg, callback) {
    console.log("In message get conversation list. Msg: ", msg);
    MessageConversation.find({"key" : {$regex : '.*' + msg.body.user + '.*'}}, function (err, results) {
        if (err) {
            console.log(err);
            console.log("Conversation list not found");
            callback(err, "Conversation list not found");
        } else {
            if (results) {
                console.log("results:", results)
                callback(null, { status: 200, messageList: results });
            }
            else {
                console.log("No results found");
                callback(null, { status: 401 });
            }
        }
    });
}

function getMessages(msg, callback) {
    console.log("In message get message list. Msg: ", msg);
    Messages.find( { '$or': 
    [ { '$and': 
         [ {  from_user_name: msg.body.fromID },
           { to_user_name: msg.body.toID  } ] 
        },
      { '$and': 
         [ {  from_user_name: msg.body.toID },
            { to_user_name: msg.body.fromID } ] 
        }] }
        , function (err, results) {
        if (err) {
            console.log(err);
            console.log("Email list not found");
            callback(err, "Email list not found");
        } else {
            if (results) {
                console.log("results:", results)
                callback(null, { status: 200, messageList: results });
            }
            else {
                console.log("No results found");
                callback(null, { status: 401 });
            }
        }
    });
}
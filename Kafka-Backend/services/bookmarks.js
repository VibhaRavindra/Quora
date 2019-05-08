var { users } = require('../models/UserSchema');
var { questions } = require('../models/QuestionSchema');
var { answers } = require('../models/AnswerSchema');
var { comments } = require('../models/CommentSchema');

exports.bookmarksService = function answerService(msg, callback) {
    console.log("Inside kafka backend answer.js");
    // console.log("msg"+ msg);
    console.log("msg", msg);
    console.log("In Property Service path:", msg.path);
    switch (msg.path) {
        case "get":
            getBookmarks(msg.body, callback);
            break;
    }
};


async function getBookmarks(message, callback) {
    console.log("Inside Kafka-Backend: Getting All Bookmarks for user")
    console.log(message.user_id);
    try {
        var userBookmarks = await users.findById(message.user_id, {bookmarks: 1});
        console.log(userBookmarks)

        callback(null, userBookmarks)

    } catch (error) {
        console.log("Getting Bookmarks Failed: " + error)
        callback(null, {
            status: 400,
            submitBookmarksMessage: "Getting Bookmarks Failed"
        })
    }

}
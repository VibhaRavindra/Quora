var { users } = require('../models/UserSchema');
var { questions } = require('../models/QuestionSchema');
var { answers } = require('../models/AnswerSchema');
var { comments } = require('../models/CommentSchema');
var { views } = require('../models/AnswerViewSchema')
var Notifications = require('../models/NotificationSchema');
exports.answerService = function answerService(msg, callback) {
    console.log("Inside kafka backend answer.js");
    // console.log("msg"+ msg);
    console.log("msg", msg);
    console.log("In Property Service path:", msg.path);
    switch (msg.path) {
        case "submit":
            if (msg.req.query.isEditing) {
                updateAnswer(msg.req, callback);
            } else {
                submitAnswer(msg.req, callback);
            }
            break;
        case "submit-comment":
            submitComment(msg.req, callback);
            break;
        case "submit-upvote":
            submitUpvote(msg.req, callback);
            break;
        case "submit-downvote":
            submitDownvote(msg.req, callback);
            break;
        case "submit-bookmark":
            submitBookmark(msg.req, callback);
            break;
        case "get-one":
            getAllAnswers(msg.req, callback);
            break;
        case "graphupvote":
            graphupvote(msg, callback);
            break;
        case "graphdownvote":
            graphdownvote(msg, callback);
            break;

    }
};

async function submitAnswer(message, callback) {
    console.log(message.params.question_id);
   let q;
    questions.findOne({ "_id": message.params.question_id }, {
        question: 1,
        _id: 0
    }, function (err, result) {
        if (err) {

}
else{
    Notifications.notifications.create({qid:message.params.question_id,
        question:result.question,
        answeredby:message.body.user_name,
        answeredby_tagline:message.body.user_tagline,
        answeredby_username:message.body.user_username,
        answeredby_profile_pic:message.body.user_profile_pic,
        timestamp_answer:new Date(),
    },function(err,res){
        if(err)
        {
             console.log("error is",err)
        }
        else{
            console.log("notification created")
        }
    })
}

    });
  

    try {
        var newAnswer = new answers({
            answer: message.body.answer,
            question_id: message.params.question_id,
            owner_username: message.body.user_username,
            owner_name: message.body.user_name,
            owner_userid: message.body.user_id,
            upvote_count: 0,
            downvote_count: 0

        });
        var answer = await newAnswer.save();
        console.log(JSON.stringify(answer))
        var questionUpdated = await questions.update({ "_id": message.params.question_id }, {
            $push: {
                answers: answer
            }
        });

        callback(null, { updateStatus: "Success", question: questionUpdated })

    } catch (error) {
        console.log("Submit Answer Failed: " + error)
        callback(null, {
            status: 400,
            submitAnswerMessage: "Submit Answer Failed"
        })
    }

}

async function updateAnswer(message, callback) {

    try {

        var answerUpdated = await answers.update({ "_id": message.body.answer_id }, {
            $set: {
                answer: message.body.answer,
                is_edited: "true",
                timestamp: Date.now()
            }
        });
        console.log(JSON.stringify(answerUpdated))
        var questionUpdated = await questions.update({ "_id": message.params.question_id, "answers._id": message.body.answer_id}, {
            $set: {
                "answers.$.answer": message.body.answer,
                "answers.$.is_edited" : "true",
                "answers.$.timestamp" : Date.now()
            }
        });
        console.log(JSON.stringify(questionUpdated))
        
        var bookmarkUpdated = await users.update({ "bookmarks.answers.0._id": message.body.answer_id }, {
            $set: {
                "bookmarks.$.answers.0.answer": message.body.answer,
                "bookmarks.$.answers.0.is_edited" : "true",
                "bookmarks.$.answers.0.timestamp" : Date.now()
            }
        });
        console.log(JSON.stringify(bookmarkUpdated))

        callback(null, { updateStatus: "Success", question: questionUpdated })

    } catch (error) {
        console.log("Edit Answer Failed: " + error)
        callback(null, {
            status: 400,
            submitAnswerMessage: "Edit Answer Failed"
        })
    }

}

async function submitComment(message, callback) {
    console.log(message.params.question_id);
    try {
        var newComment = new comments({
            comment: message.body.comment,
            owner_username: message.body.user_username,
            owner_userid: message.body.user_id,
            owner_name: message.body.user_name,
        });

        var comment = await newComment.save();
        console.log(JSON.stringify(comment))
        var questionUpdated = await questions.update({ "_id": message.params.question_id, "answers._id": message.params.answer_id }, {
            $push: {
                "answers.$.comments": comment
            }
        });

        var answerUpdated = await answers.update({ "_id": message.params.answer_id }, {
            $push: {
                comments: comment
            }
        });

        callback(null, { updateStatus: "Success", question: questionUpdated })

    } catch (error) {
        console.log("Submit Comment Failed: " + error)
        callback(null, {
            status: 400,
            submitCommentMessage: "Submit Comment Failed"
        })
    }

}
async function submitUpvote(message, callback) {
    console.log(message.params.question_id);
    try {
        var upvoteState = message.query.upvote;
        console.log(JSON.stringify(upvoteState))

        if (upvoteState === "true") {
            var questionUpdated = await questions.update({ "_id": message.params.question_id, "answers._id": message.params.answer_id }, {
                $push: {
                    "answers.$.upvotes": message.body.user_username
                },
                $inc: {
                    "answers.$.upvote_count": 1
                }
            });

            var answerUpdated = await answers.update({ "_id": message.params.answer_id }, {
                $push: {
                    upvotes: message.body.user_username
                },
                $inc: {
                    upvote_count: 1
                }
            });

            var userUpdated = await users.update({ "bookmarks.answers.0._id": message.params.answer_id }, {
                $push: {
                    "bookmarks.$.answers.0.upvotes": message.body.user_username
                },
                $inc: {
                    "bookmarks.$.answers.0.upvote_count": 1
                }
            })

            callback(null, { updateStatus: "Success", question: questionUpdated })
        } else if (upvoteState === "false") {
            var questionUpdated = await questions.update({ "_id": message.params.question_id, "answers._id": message.params.answer_id }, {
                $pull: {
                    "answers.$.upvotes": message.body.user_username
                },
                $inc: {
                    "answers.$.upvote_count": -1
                }
            });

            var answerUpdated = await answers.update({ "_id": message.params.answer_id }, {
                $pull: {
                    upvotes: message.body.user_username
                },
                $inc: {
                    upvote_count: -1
                }
            });

            var userUpdated = await users.update({ "bookmarks.answers.0._id": message.params.answer_id }, {
                $pull: {
                    "bookmarks.$.answers.0.upvotes": message.body.user_username
                },
                $inc: {
                    "bookmarks.$.answers.0.upvote_count": -1
                }
            })

            callback(null, { updateStatus: "Success", question: questionUpdated })
        } else {
            throw "invalid upvote state"
        }
    } catch (error) {
        console.log("Submit Comment Failed: " + error)
        callback(null, {
            status: 400,
            submitCommentMessage: "Submit Comment Failed"
        })
    }

}

async function submitDownvote(message, callback) {
    console.log(message.params.question_id);
    try {
        var downvoteState = message.query.downvote;
        console.log(JSON.stringify(downvoteState))

        if (downvoteState === "true") {
            var questionUpdated = await questions.update({ "_id": message.params.question_id, "answers._id": message.params.answer_id }, {
                $push: {
                    "answers.$.downvotes": message.body.user_username
                },
                $inc: {
                    "answers.$.downvote_count": 1
                }
            });

            var answerUpdated = await answers.update({ "_id": message.params.answer_id }, {
                $push: {
                    downvotes: message.body.user_usernamezx
                },
                $inc: {
                    downvote_count: 1
                }
            });

            var userUpdated = await users.update({ "bookmarks.answers.0._id": message.params.answer_id }, {
                $push: {
                    "bookmarks.$.answers.0.downvotes": message.body.user_username
                },
                $inc: {
                    "bookmarks.$.answers.0.downvote_count": 1
                }
            })

            callback(null, { updateStatus: "Success", question: questionUpdated })
        } else if (downvoteState === "false") {
            var questionUpdated = await questions.update({ "_id": message.params.question_id, "answers._id": message.params.answer_id }, {
                $pull: {
                    "answers.$.downvotes": message.body.user_username
                },
                $inc: {
                    "answers.$.downvote_count": -1
                }
            });

            var answerUpdated = await answers.update({ "_id": message.params.answer_id }, {
                $pull: {
                    downvotes: message.body.user_username
                },
                $inc: {
                    downvote_count: -1
                }
            });

            var userUpdated = await users.update({ "bookmarks.answers.0._id": message.params.answer_id }, {
                $pull: {
                    "bookmarks.$.answers.0.downvotes": message.body.user_username
                },
                $inc: {
                    "bookmarks.$.answers.0.downvote_count": -1
                }
            })


            callback(null, { updateStatus: "Success", question: questionUpdated })
        } else {
            throw "invalid downvote state"
        }
    } catch (error) {
        console.log("Submit Comment Failed: " + error)
        callback(null, {
            status: 400,
            submitCommentMessage: "Submit Comment Failed"
        })
    }

}

async function submitBookmark(message, callback) {
    console.log(message.params.question_id);
    console.log(message.params.answer_id);
    try {
        var bookmarkState = message.query.bookmarkState;
        console.log(JSON.stringify(bookmarkState))

        if (bookmarkState === "true") {

            var questionUpdated = await questions.update({ "_id": message.params.question_id, "answers._id": message.params.answer_id }, {
                $push: {
                    "answers.$.bookmarked_by": message.body.user_username
                }
            });

            var answerUpdated = await answers.update({ "_id": message.params.answer_id }, {
                $push: {
                    bookmarked_by: message.body.user_username
                }
            });

            var questionBookmarked = await questions.findOne({ "_id": message.params.question_id }, {
                question: 1,
                topic_name: 1,
                owner_id: 1,
                owner_username: 1,
                owner_name: 1,
                followers: 1,
                timestamp: 1,
                answers: { $elemMatch: { "_id": message.params.answer_id } }
            });
            console.log(JSON.stringify(questionBookmarked));

            var userUpdated = await users.update({ "_id": message.body.user_id }, {
                $push: {
                    bookmarks: questionBookmarked
                }
            });


            callback(null, { updateStatus: "Success", question: userUpdated })
        } else if (bookmarkState === "false") {

            var questionUpdated = await questions.update({ "_id": message.params.question_id, "answers._id": message.params.answer_id }, {
                $pull: {
                    "answers.$.bookmarked_by": message.body.user_username
                }
            });

            var answerUpdated = await answers.update({ "_id": message.params.answer_id }, {
                $pull: {
                    bookmarked_by: message.body.user_username
                }
            });

            var userUpdated = await users.update({ "_id": message.body.user_id }, {
                $pull: {
                    bookmarks: { "answers.0._id": message.params.answer_id }
                }
            });

            console.log("````````````````````````````````````````````````````")
            console.log(message.params.answer_id)
            console.log(userUpdated)
            console.log("````````````````````````````````````````````````````")

            callback(null, { updateStatus: "Success", question: userUpdated })
        } else {
            throw "invalid upvote state"
        }
    } catch (error) {
        console.log("Submit bookmark Failed: " + error)
        callback(null, {
            status: 400,
            submitBookmarkMessage: "Submit Bookmark Failed"
        })
    }

}


async function getAllAnswers(message, callback) {
    console.log("Inside Kafka-Backend: Getting All Answers for a question")
    console.log(message.params.answer_id);
    try {
        var question = await questions.findById(message.params.question_id);
        console.log(question)

        callback(null, { updateStatus: "Success", question: question })

    } catch (error) {
        console.log("Getting Answer Failed: " + error)
        callback(null, {
            status: 400,
            submitAnswerMessage: "Getting Answer Failed"
        })
    }

}

async function graphupvote(message, callback) {

    try {

        var answer = await answers.find({ owner_username: message.body.owner_username }, { "_id": 1, "upvote_count": 1 }).sort(
            {
                "upvote_count": -1.0,
                "downvote_count": 1.0
            }
        ).limit(10);
        console.log(answer)

        callback(null, { updateStatus: "Success", answer: answer })

    } catch (error) {
        console.log("Getting Answer Failed: " + error)
        callback(null, {
            status: 400,
            submitAnswerMessage: "Getting Answer Failed"
        })
    }

}




async function graphdownvote(message, callback) {

    try {
        var answer = await answers.find({ owner_username: message.body.owner_username }, { "_id": 1, "downvote_count": 1 }).sort(
            {
                "downvote_count": -1.0,
                "upvote_count": 1.0
            }
        ).limit(10);
        console.log(answer)

        callback(null, { updateStatus: "Success", answer: answer })

    } catch (error) {
        console.log("Getting Answer Failed: " + error)
        callback(null, {
            status: 400,
            submitAnswerMessage: "Getting Answer Failed"
        })
    }

}



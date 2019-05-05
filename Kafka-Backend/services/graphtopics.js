var ProfileViews = require('../models/ProfileViewsSchema');

exports.graphService = function graphService(msg, callback) {
    console.log("In graph Service path:", msg.path);
    switch (msg.path) {
        case "increase_profile_view":
            increaseProfileViewCount(msg, callback);
            break;
        case "get_profile_views":
             getProfileViews(msg, callback);
             break;
    }
}


function increaseProfileViewCount(msg, callback) {

    console.log("In increse profile view count. Msg: ", msg);
    ProfileViews.findOne({ user_id: msg.body.user_id, "day": msg.body.day, "month": msg.body.month, "year": msg.body.year }, function (err, results) {
        if (err) {
            console.log(err);
            console.log("Database error");
            callback(err, "Database error");
        } else {
            if (results) {
                console.log(results);
                ProfileViews.findOneAndUpdate({ user_id: msg.body.user_id, "day": msg.body.day, "month": msg.body.month, "year": msg.body.year },
                    {$inc: { "views": 1 }}, function(error, result) {
                            if (error) {
                                console.log(error.message);
                                callback(err, "Database error");
                            } else {
                                console.log(result);
                                callback(null, { status: 200 });
                            }
                        });
                }
            else {
                console.log("in else part");
                ProfileViews.create({ user_id: msg.body.user_id, "day": msg.body.day, "month": msg.body.month, "year": msg.body.year, "views": 1 },
                  function (error, result) {
                                    if (error) {
                                        console.log(error.message);
                                        callback(err, "Database error");
                                    } else {
                                        console.log(result);
                                        callback(null, { status: 200 });
                                    }
                                });
                        }
                    }
    });
}

function getProfileViews(msg, callback) {
    console.log("In get profile view count. Msg: ", msg);
    ProfileViews.find({ "user_id": msg.body.user_id, "month": msg.body.month, "year": msg.body.year }, function (err, results) {
        if (err) {
            console.log(err);
            callback(err, "Database error");
        } else {
            if (results) {
                console.log(results);
                callback(null, { status: 200, profileviews: results });
                }
            else {
                console.log("in else part");
                callback(null, { status: 204, msg: "No results found" });
            }
        }
    });
}
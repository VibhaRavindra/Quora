var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
ProfileViewsSchema = new Schema({
 user_id: {
	type: String,
	required: true
  },
  month:{
	type: Number,
	reuired: true
},
  year: {
    type: Number,
    required: true
  },
  day:{
      type:Number,
      required: true
  },
  views: {
      type:Number,
      required: true
  }
});
    
module.exports = mongoose.model('ProfileViews', ProfileViewsSchema); 
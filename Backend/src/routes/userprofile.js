var express = require('express');
var router = express.Router();

const User = require('../models/UserSchema');

//route GET routes/answers

router.get('/', (req,res)=>{

    User.find()
    .then(answer => res.json(answer))
});

//route post routes/answers
router.post('/', (req,res)=>{
  const newanswer = new User({
      answer: req.body.answer
  })
  newanswer.save()
  .then(answer => res.json(answer));
});

//route post routes/question
router.post('/', (req,res)=>{
    const newquestion = new User({
        question: req.body.question
    })
    newanswer.save()
    .then(answer => res.json(answer));
  });

  module.exports = router
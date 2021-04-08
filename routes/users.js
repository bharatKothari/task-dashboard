var express = require('express');
var bodyParser = require('body-parser');
var authenticate = require('../utils/authenticate')
var User = require('../models/User');
var router = express.Router();

router.use(bodyParser.json())

router.post('/signup',(req,res,next) => {
  console.log(req.body)
  User.register(new User({
    email : req.body.email,
    name : req.body.name,
    role : req.body.role,
  }),req.body.password)
  .then((user) => {
    if(user.role === "Manager"){
      //redirect to /manager
      res.json({
        name : user.name,
        email : user.email,
        role : user.role,
        token : authenticate.getToken({ email : user.email })
      })
    }
    else{
      //redirect to /worker
      res.json({
        name : user.name,
        email : user.email,
        role : user.role,
        rewards : user.rewards,
        tasks : user.tasks,
        token : authenticate.getToken({ email : user.email })
      })
    }
  })
  .catch((err) => {
    res.status(409).send(err)
  })
})

router.post('/login',authenticate.local,(req,res,next) => {
  user = req.user
  if(user.role === "Manager"){
    //redirect to /manager
    res.json({
      name : user.name,
      email : user.email,
      role : user.role,
      token : authenticate.getToken({ email : user.email })
    })
  }
  else{
    //redirect to /worker
    res.json({
      name : user.name,
      email : user.email,
      role : user.role,
      rewards : user.rewards,
      tasks : user.tasks,
      token : authenticate.getToken({ email : user.email })
    })
  }
})

module.exports = router;

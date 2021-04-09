var express = require('express');
var bodyParser = require('body-parser');
var authenticate = require('../utils/authenticate')
var User = require('../models/User');
var router = express.Router();

router.use(bodyParser.json())

router.route('/signup')
.get((req,res,next) => {
  res.render('signup',{title : 'Signup'})
})
.post((req,res,next) => {
  console.log(req.body)
  User.register(new User({
    email : req.body.email,
    name : req.body.name,
    role : req.body.role,
  }),req.body.password)
  .then((user) => {
    res.json({
      user : user,
      token : authenticate.getToken({ email : user.email })
    })
  })
  .catch((err) => {
    res.status(409).send(err)
  })
})

router.route('/login')
.get((req,res,next) => {
  res.render('login', {title:'Login'} );
})
.post(authenticate.local,(req,res,next) => {
  user = req.user
  res.json({
    user : user,
    token : authenticate.getToken({ email : user.email })
  })
})

router.route('/profile')
.get(authenticate.verifyUser,(req,res,next) => {
  res.json(req.user)
})

module.exports = router;

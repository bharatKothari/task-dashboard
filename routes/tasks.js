var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var authenticate = require('../utils/authenticate')
var User = require('../models/User');
var Task = require('../models/Task');
var router = express.Router();
var upload = multer()

router.use(bodyParser.json())

router.route('/')
.get(authenticate.verifyUser,(req,res,next) => {
    Task.find({status:'Pending'})
    .then((tasks) => {
        res.json(tasks)
    })
})
.post(authenticate.verifyManager,(req,res,next) => {
    Task.create({
        subject : req.body.subject,
        details : req.body.details,
        time : req.body.time,
        points : req.body.points,
        status : 'Pending'
    })
    .then((task) => {
        res.json(task)
    })
    .catch((err) => {
        res.send(err)
    })
})

router.route('/:taskId')
.get(authenticate.verifyUser,(req,res,next) => {
    Task.findById(req.params.taskId)
    .then((task) => {
        res.json(task)
    })
    .catch((err) => {
        res.send(err)
    })
})
.put(authenticate.verifyUser,(req,res,next) => {

})

module.exports = router
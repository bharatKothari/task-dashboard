var express = require('express');
var bodyParser = require('body-parser');
var authenticate = require('../utils/authenticate')
var User = require('../models/User');
var Task = require('../models/Task');
var router = express.Router();

router.use(bodyParser.json())

router.get('/',authenticate.verifyUser,(req,res,next) => {
    Task.find({status:'Pending'})
    .then((tasks) => {
        res.json(tasks)
    })
})

router.post('/',authenticate.verifyManager,(req,res,next) => {
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

router.get('/:taskId',authenticate.verifyUser,(req,res,next) => {
    Task.findById(req.params.taskId)
    .then((task) => {
        res.json(task)
    })
    .catch((err) => {
        res.send(err)
    })
})

module.exports = router
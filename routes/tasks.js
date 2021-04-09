var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var authenticate = require('../utils/authenticate')
var User = require('../models/User');
var Task = require('../models/Task');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, req.params.taskId + '-' + file.originalname)
    }
})

var upload = multer({
    storage: storage
})

var router = express.Router();
router.use(bodyParser.json())

router.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        Task.find({ status: 'Pending' })
            .then((tasks) => {
                res.json(tasks)
            })
    })
    .post(authenticate.verifyManager, (req, res, next) => {
        Task.create({
            subject: req.body.subject,
            details: req.body.details,
            time: req.body.time,
            points: req.body.points,
            status: 'Pending'
        })
            .then((task) => {
                res.json(task)
            })
            .catch((err) => {
                res.send(err)
            })
    })

router.route('/:taskId')
    .get(authenticate.verifyUser, (req, res, next) => {
        Task.findById(req.params.taskId)
            .then((task) => {
                res.json(task)
            })
            .catch((err) => {
                res.send(err)
            })
    })
    .put(authenticate.verifyUser, upload.array('files'), (req, res, next) => {
        const reqFiles = [];
        const url = 'http://localhost:5000/'
        for (var i = 0; i < req.files.length; i++) {
            reqFiles.push(url + 'public/uploads/' + req.files[i].filename)
        }
        Task.findByIdAndUpdate(req.params.taskId, {
            attachments: reqFiles,
            ...req.body
        }).then((task) => {
            res.json(task)
        }).catch((err) => {
            res.send(err)
        })
    })

module.exports = router
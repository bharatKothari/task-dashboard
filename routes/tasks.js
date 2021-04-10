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
        const filter = {}
        if (req.body.status) filter.status = req.body.status
        if (req.body.after) {
            filter.creationDate = {
                $gt: new Date(req.body.after)
            }
        }
        else if (req.body.before) {
            filter.creationDate = {
                $lt: new Date(req.body.before)
            }
        }
        Task.find(filter)
            .then((tasks) => {
                res.json(tasks)
            })
            .catch((err) => {
                res.send(err)
            })
    })
    .post(authenticate.verifyManager, (req, res, next) => {
        Task.create({
            subject: req.body.subject,
            details: req.body.details,
            time: req.body.time,
            points: req.body.points,
            status: 'Assigned'
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
            reqFiles.push(url + req.files[i].path)
        }
        Task.findByIdAndUpdate(req.params.taskId, {
            attachments: reqFiles,
            status: 'Pending',
            user: req.user._id,
            ...req.body
        }, {
            new: true
        }).then((task) => {
            User.findById(req.user._id)
                .then((user) => {
                    if (user.tasks.indexOf(task._id) === -1) {
                        user.tasks.push(task._id)
                    }
                    user.save()
                    res.json(task)
                }).catch((err) => {
                    next(err)
                })
        }).catch((err) => {
            res.send(err)
        })
    })

router.route('/:taskId/review')
    .put(authenticate.verifyManager, (req, res, next) => {
        if (req.body.status = 'Accepted') {
            Task.findByIdAndUpdate(req.params.taskId, {
                completionDate: new Date(),
                ...req.body
            }, {
                new: true
            }).then((task) => {
                User.findById(task.user)
                    .then((user) => {
                        console.log(user)
                        user.points += task.points
                        user.save()
                        res.json(task)
                    }).catch((err) => {
                        next(err)
                    })
            }).catch((err) => {
                res.send(err)
            })
        }
        else {
            Task.findByIdAndUpdate(req.params.taskId, {
                ...req.body
            }, {
                new: true
            }).then((task) => {
                res.json(task)
            }).catch((err) => {
                res.send(err)
            })
        }
    })

module.exports = router
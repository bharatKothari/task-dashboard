const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    subject : String,
    details : String,
    time : String,
    points : Number,
    status : String,
    creationDate : {
        type : Date,
        default : Date.now
    },
    completionDate : Date,
    submission : String,
    attachments : [String],
    user : {
        type : String,
        ref : "User"
    }
});

const Task = mongoose.model("Task",taskSchema);
module.exports = Task;
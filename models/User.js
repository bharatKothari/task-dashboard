const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : String,
    role : String,
    rewards : Number,
    tasks : [{
        type : Number,
        ref : "Task"
    }]
});
userSchema.plugin(passportLocalMongoose,{usernameField : "email"})

const User = mongoose.model("User",userSchema);
module.exports = User;
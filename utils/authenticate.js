const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const config = require('../config')

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.local = passport.authenticate('local')

exports.getToken = (user) => {
    return jwt.sign(user,config.secretKey)
}

var opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : config.secretKey
}

passport.use(new JwtStrategy(opts,(jwt_payload,done) => {
    User.findOne({email:jwt_payload.email},(err,user) => {
        if(err){
            return done(err,false);
        }
        else if(user){
            return done(null,user);
        }
        else{
            return done(null,false);
        }
    })
}))

exports.verifyUser = (req,res,next) => {
    passport.authenticate('jwt',{session:false},(err,user) => {
        if(!err && user){
            req.user = user;
            next()
        }
        else{
            res.status(401).send('Unauthorized')
        }
    })(req,res,next)
}

exports.verifyManager = (req,res,next) => {
    passport.authenticate('jwt',{session:false},(err,user) => {
        if(!err && user && user.role === 'Manager'){
            req.user = user;
            next()
        }
        else{
            res.status(401).send('Unauthorized')
        }
    })(req,res,next)
}
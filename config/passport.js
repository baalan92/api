const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
// const User = mongoose.model('User');
const keys = require('../config/keys');
const User = require('../models/user');

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload._doc._id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }
                    if(!user) {
                            req.flash('error', 'You must be logged in to access that page');

                    }
                    //return done(null, false);
                })
                .catch(err => console.log(err))
        })
    );
};
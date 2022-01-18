const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

const userModel = require('../models/User');

const ACCOUNT_NOT_EXIST_NOTI = 'Account does not exist!';
const INVALID_PASSWORD_NOTI = 'Invalid Password!';

module.exports = app => {
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            console.log('get in local strategy');
            console.log('Username', username);
            console.log('Password', password);
            let user;
            try {
                user = await userModel.getUserByName(username);
                if (!user) { return done(null, false, { message: ACCOUNT_NOT_EXIST_NOTI }); } 

                const auth = await userModel.auth(username, password);
                if (!auth) { return done(null, false, { message: INVALID_PASSWORD_NOTI }); }
                
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
      
    passport.deserializeUser(async (user, done) => {
        try {
            const muser = await userModel.getUserByName(user.f_Username);
            done(null, muser);
        } catch (error) {
            done(new Error('error'), null); // crash system when new Error execute
        }
    });

    app.use(passport.initialize());
    app.use(passport.session());
}
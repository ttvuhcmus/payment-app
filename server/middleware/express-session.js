const session = require('express-session');

const secretString = 'secretstring1612459'

module.exports = app => {
    app.use(session({
        secret: secretString,
        resave: false,
        saveUninitialized: true
    }));
}
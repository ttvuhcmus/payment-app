const siteRouter = require('./sites');

function route(app) {
    app.use('/', siteRouter);
}

module.exports = route;
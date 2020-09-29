var UserRoutes = require('./UserRoutes');

module.exports = function (router) {
    router.use('/user', UserRoutes())
    return router;
}
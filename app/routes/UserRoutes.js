var authController = require('../controllers/userController');
var router = require('express').Router();

module.exports = function(){
    const authCtrl = new authController();
    router.post('/register', authCtrl.register);


    return router;
}
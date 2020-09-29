const service = require('../middleware/tokenGenerator');

module.exports = function authControllers(){
    this.register = (req,res,next)=>{
        service.googleSocialSignup().then(data =>{
            res.json(data);
        })
        .catch(err => {
            res.json(err);
          });
    }
}
var jwt = require("jsonwebtoken");
var secret = process.env.Secret;
exports.generateToken =(data = {})=> {
    return new Promise((resolve, reject) => {
      jwt.sign({ ...data }, secret, { expiresIn: "24hrs" }, function (err, token) {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      });
    });
  }
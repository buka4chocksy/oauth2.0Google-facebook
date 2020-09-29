const model = require('../model/user');
var passport = require('passport');
const tokenGen = require('../middleware/tokenGenerator')
var GoogleStrategy = require('passport-google-oauth20').Strategy;

        passport.serializeUser(function(user, done) {
            console.log('serialize: ', user)
            done(null, user);
          });
          
        //   passport.deserializeUser(function(id, done) {
        //     User.findById(id, function(err, user) {
        //       done(err, user);
        //     });
        //   });
        
        passport.deserializeUser(function(user, done) {
            console.log('deserialize :', user)
              done(null, user);
          });
        
         passport.use(new GoogleStrategy({
            clientID: '81564891976-inpoudlp1l8cqk1pjqo6gdlggmv4ttb9.apps.googleusercontent.com',
            clientSecret: 'hbTSUrWs-guwRrnsFiUZdqNb',
            callbackURL: "http://localhost:8080/google/callback"
          },
        function (accessToken, refreshToken, profile, done) {
            console.log(profile._json , 'lolllll')
              const details= {
                authId:profile._json.sub,
                firstname:profile._json.family_name,
                lastname:profile._json.given_name,
                profilepix:profile._json.picture,
                email:profile._json.email
              }
                model.findOne({email:details.email}, async function(err , found){
                  if(found){
               let result = await  tokenGen.generateToken(found)
               const data = {token:result , data:found , message:'authentication was successfull'}
               console.log(data , 'hhmmmmm')

                    return done(err , data);
                  }else{
                    model.create(details, async function (err, user) {
                        let findUser = await model.findOne({email:details.email})
                        let result = await  tokenGen.generateToken(findUser)
                        const data = {token:result , data:findUser , message:'authentication was successfull'}         
                        return done(err, data);
                      });
                  }
              })
          }
        ));
        
        
        // passport.use(new GoogleStrategy({
        //     clientID: '81564891976-inpoudlp1l8cqk1pjqo6gdlggmv4ttb9.apps.googleusercontent.com',
        //     clientSecret: 'hbTSUrWs-guwRrnsFiUZdqNb',
        //     callbackURL: "http://localhost:8080/google/callback"
        //   },
        //   function(accessToken, refreshToken, profile, done) {
        //       console.log('see details , here',profile )
        //         return done(null, profile);
        //   }
        // ));

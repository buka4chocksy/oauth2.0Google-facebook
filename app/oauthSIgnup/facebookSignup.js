const model = require('../model/user');
var passport = require('passport');
const tokenGen = require('../middleware/tokenGenerator')
const facebookStrategy = require('passport-facebook').Strategy

passport.serializeUser(function (user, done) {
    console.log('serialize: ', user)
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    console.log('deserialize :', user)
    done(null, user);
});

passport.use(new facebookStrategy({
    clientID: '236116033682171',
    clientSecret: 'd31ce8315cd461ebf15ee919053a70c9',
    callbackURL: "http://localhost:8080/facebook/callback",
    profileFields: ['id', 'displayName', 'profileUrl', 'name', 'gender', 'picture.type(large)', 'email']
},
    function (accessToken, refreshToken, profile, done) {
        const details = {
            authId: profile._json.id,
            firstname: profile._json.first_name,
            lastname: profile._json.last_name,
            profilepix: profile._json.picture.data.url,
            email: profile._json.email
        }

        model.findOne({ email: details.email }, async function (err, found) {
            if (found) {
                let result = await tokenGen.generateToken(found)
                const data = { token: result, data: found, message: 'authentication was successfull' }
                return done(err, data);
            } else {
                model.create(details, async function (err, user) {
                    let findUser = await model.findOne({ email: details.email })
                    let result = await tokenGen.generateToken(findUser)
                    const data = { token: result, data: findUser, message: 'authentication was successfull' }
                    return done(err, data);
                });
            }
        })
    }
));

var express = require('express');
var app = express();
var morgan = require('morgan');
var cookieparser = require('cookie-parser');
require('./app/oauthSIgnup/facebookSignup')
require('dotenv').config();
var router = express.Router();
var rootRouter = require('./app/routes/index')(router);
var cors = require('cors');
var passport = require('passport');
var cookieSession = require('cookie-session')
var dbConfiguration = require('./app/config/DB');

const bodyParser = require('body-parser');
require ('./app/oauthSIgnup/googleSignup')

//cronjb


//middleware
app.use(cors({allowedHeaders : "*"}));
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
app.use(cookieSession({
    name: 'test-session',
    keys: ['key1', 'key2']
  }))

app.use('/api', rootRouter);

app.get('/' , (req,res)=>{
    res.render("index.ejs")
})
app.get("/failed", (req,res)=> res.send("you have failed to login"));
app.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
      const userDetails =  req.user
  res.status(200).send(userDetails) 
//res.redirect('/good');
  });
  app.get('/auth/facebook',passport.authenticate('facebook', {scope:'email'}));
  app.get('/facebook/callback', passport.authenticate('facebook',{ failureRedirect:'/failed'}), 
  function(req, res) {
    const userDetails =  req.user
res.status(200).send(userDetails) 
})

app.get('/logout', (req,res)=>{
    req.session = null
    req.logOut();
    res.redirect('/')

})
dbConfiguration();

module.exports = app;
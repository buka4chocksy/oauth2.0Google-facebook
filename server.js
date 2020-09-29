var express = require('express');
var app = express();
var morgan = require('morgan');
var cookieparser = require('cookie-parser');
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
   
  const isLoggedin = (req,res,next)=>{
    if(req){
        next()
    }else{
        res.sendStatus(401)
    }
  }
app.use('/api', rootRouter);

app.get("/", (req,res)=> res.send("you are not logged in"));
app.get("/failed", (req,res)=> res.send("you have failed to login"));
app.get("/good", isLoggedin,(req,res)=> res.send("login was successful"));

app.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
      const userDetails =  req.user
      console.log(req.user)
  res.status(200).send(userDetails) 
//res.redirect('/good');
  });

app.get('/logout', (req,res)=>{
    req.session = null
    req.logOut();
    res.redirect('/')

})
app.get('/policy', function (req, res) {
    res.sendFile(__dirname + '/public/views/policy.html')
});

dbConfiguration();

module.exports = app;
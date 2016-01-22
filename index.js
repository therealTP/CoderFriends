var express = require('express'),
    expressSession = require('express-session'),
    passport = require('passport'),
    githubApi = require('github'),
    ghStrategy = require('passport-github').Strategy; // import only strategy you need

// set up & start app
var app = express(),
    port = 9000;

app.listen(port, function() {
  console.log('app listening on port', port);
});

// serve front end files in public folder
app.use(express.static(__dirname + '/public'));

// config express-session, needs to be BEFORE passport.initialize()
app.use(expressSession({
  secret: 'MY_SECRET',
  resave: true,
  saveUninitialized: false
}));

app.use(passport.initialize());

// serialize/deserialize users. this supports persistent login sessions
// in this example,the entire github user object is serialized
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(passport.session());

// configure gh strategy
passport.use(new ghStrategy(
  // first arg: config options obj for gh app
  {
    clientID: 'MY_CLIENT_ID',
    clientSecret: 'MY_CLIENT_SECRET',
    callbackURL: '/auth/github/callback' // if app is valid, get this url
  },
  // second arg: 'verify' function, which accepts token & gh profile,
  function(accessToken, refreshToken, profile, done) {
    // return user's gh profile to represent logged in user
    // normally, you'd associate the gh account with a user record in your db, find that user, and return your own user data
    // console.log(profile);
    return done(null, profile);
  }
));

// initalize passport!

// require auth middleware
// pass into endpoint uninvoked, as arg
var requireAuth = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(403).end();
  }
  return next();
};

// initial GET request for auth through gh (via link/button in view) goes to this endpoint:
app.get('/auth/github', passport.authenticate('github'));

// this endpoint dictates what will happen after auth is sucessful
app.get('/auth/github/callback',
  passport.authenticate('github',
    {
      failureRedirect: '/#/login' // auth failed, redirect to login
    }
  ),
  // auth successful, redirect home
  function(req, res) {
    res.redirect('/#/home');
  }
);

var github = new githubApi({
    // required
    version: "3.0.0",
    // optional
    debug: true,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    timeout: 5000,
    headers: {
        "user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
    }
});

app.get('/github/following', requireAuth, function(req, res) {
  console.log(req.user.username);
  github.user.getFollowingFromUser({
    user: req.user.username
  }, function(err, result) {
    if (err) {
      res.sendStatus(500, err);
    }
    res.send(result);
  });
});

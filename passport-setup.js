const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

// passport.serializeUser(function(user, done){
//     done(null, user.id);
// });

// passport.deserializeUser(function(id, done){
//     User.findById(id, function(err, user){
//         done(err, user);
//     });
// });

mongoose.connect("mongodb+srv://admin-aniruddha:Test123@cluster0.vbdcu.mongodb.net/searchActivity", {useNewUrlParser: true});

const listSchema = {
    name: String,
    email: String,
    searchHistory: [String]
  };
  
const List = mongoose.model("List", listSchema);
  

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user, done){
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: '626295841066-v9fqe1dkmkmr2ncfoh3h2m6bo206n0qf.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:5000/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    return cb(null, profile);
  }
));
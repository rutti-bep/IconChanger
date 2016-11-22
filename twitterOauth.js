// http://passportjs.org/guide/twitter/
var keys = require("./CONSUMER_KEY.json");
var TWITTER_CONSUMER_KEY = keys[0];
var TWITTER_CONSUMER_SECRET = keys[1];
var passport = require('passport')
, TwitterStrategy = require('passport-twitter').Strategy;

// Sessionの設定
// http://passportjs.org/guide/configure/
passport.serializeUser(function(user, done) {
		done(null, user.id);
		});
passport.deserializeUser(function(obj, done) {
		done(null, obj);
		});

passport.use(new TwitterStrategy({
consumerKey: TWITTER_CONSUMER_KEY,
consumerSecret: TWITTER_CONSUMER_SECRET,
callbackURL: "http://localhost:3000/auth/twitter/callback",
passReqToCallback: true
},
function(req,token, tokenSecret, profile, done) {
passport.session.id = profile.id;
console.log(req.query);
// tokenとtoken_secretをセット
profile.twitter_token = token;
profile.twitter_token_secret = tokenSecret;

process.nextTick(function () {
		return done(null, profile);
		});
}
));

module.exports = {passport: passport};

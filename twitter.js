"use strict";
var twitter = require('twitter');
var keys = require("./CONSUMER_KEY.json");
var TWITTER_CONSUMER_KEY = keys[1];
var TWITTER_CONSUMER_SECRET = keys[2];

var OAuth = require('oauth').OAuth;
var oauth = new OAuth(
				'https://api.twitter.com/oauth/request_token',
				'https://api.twitter.com/oauth/access_token',
				TWITTER_CONSUMER_KEY,
				TWITTER_CONSUMER_SECRET,
				'1.0A',
				'http://127.0.0.1:3000/auth/twitter/callback',
				'HMAC-SHA1'
);

function twitterOauthSetUp(app){
	app.get('/auth/twitter',function(req,res){
				console.log(req);
		oauth.getOAuthRequestToken(function(error,oauthToken,oauthTokenSecret,results){
			if(error){
				console.log(error);
				res.send("yeah no. didn't work.");
			}else{
				req.session.twitterOAuth = {};
				req.session.twitterOAuth.token = oauthToken;
				req.session.twitterOAuth.tokenSecret = oauthTokenSecret;
				res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauthToken);
			}
		});
	})

	app.get('/auth/twitter/callback', function(req, res, next){
		if (req.session.twitterOAuth) {
			req.session.twitterOAuth.verifier = req.query.oauth_verifier;
			var sessionOAuth = req.session.twitterOAuth;
			oauth.getOAuthAccessToken(sessionOAuth.token,sessionOAuth.tokenSecret,sessionOAuth.verifier,
				function(error, oauthAccessToken, oauthAccessTokenSecret, results){
					if(error){
						console.log(error);
					}else{
						req.session.twitterOAuth.accessToken = oauthAccessToken;
						req.session.twitterOAuth.accessTokenSecret = oauthAccessTokenSecret;
						//res.send("TOPページに移動します");
						res.redirect('http://127.0.0.1:3000');
					}
			})
		}else{
				res.redirect('/auth/twitter');
		} 
	})
}

function twitterIconChangeRequest(req,image){
	var client = new Twitter({
		consumer_key: TWITTER_CONSUMER_KEY,
		consumer_secret: TWITTER_CONSUMER_SECRET,
		access_token_key: req.session.twitterOAuth.accessToken,
		access_token_secret: req.session.twitterOAuth.accessTokenSecret
	})

	client.get('account/update_profile_image',image,function(error,responce){
		if(!error){
			console.log(error);	
		}
		console.log(responce);
	})
}

function b64encode(str){
	return new Buffer(str).toString('base64');
}

module.exports = {twitterOauthSetUp : twitterOauthSetUp, twitterIconChangeRequest: twitterIconChangeRequest}

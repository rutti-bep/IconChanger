"use strict";
var fs = require('fs');
var twitter = require('twitter');
var TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
var TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
var IPSetting = process.env.IPSetting;
var portSetting = "";
if(!/(heroku)/.exec(IPSetting)){
	portSetting = ":"+(process.env.PORT || 3000).toString();
}
console.log(IPSetting+portSetting+'/');

var OAuth = require('oauth').OAuth;
var oauth = new OAuth(
				'https://api.twitter.com/oauth/request_token',
				'https://api.twitter.com/oauth/access_token',
				TWITTER_CONSUMER_KEY,
				TWITTER_CONSUMER_SECRET,
				'1.0A',
				IPSetting+portSetting+'/auth/twitter/callback',
				'HMAC-SHA1'
);

function twitterOauthSetUp(app){
	app.get('/auth/twitter',function(req,res){
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
						res.redirect(IPSetting + portSetting + "/");
					}
			})
		}else{
				res.redirect('/auth/twitter');
		} 
	})
}

function twitterIconChangeRequest(req){
	var image;
	var client = new twitter({
		consumer_key: TWITTER_CONSUMER_KEY,
		consumer_secret: TWITTER_CONSUMER_SECRET,
		access_token_key: req.session.twitterOAuth.accessToken,
		access_token_secret: req.session.twitterOAuth.accessTokenSecret
	})
	try{
		image = fs.readFileSync('./'+req.file.path);
		fs.unlinkSync('./'+req.file.path);
	}catch(error){ 
		console.log(error);
		return "error!!";
	}


	image = b64Encode(image);

	client.post('account/update_profile_image',{image: image},function(error,responce){
		if(error){
			console.log(error);	
			return "error!!";
		}else{
			return "success!!";
		}
	})
	
}

function b64Encode(str){
	return new Buffer(str).toString('base64');
}

module.exports = {twitterOauthSetUp : twitterOauthSetUp, twitterIconChangeRequest: twitterIconChangeRequest}

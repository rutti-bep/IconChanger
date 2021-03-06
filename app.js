'use strict';
var http = require('http');
var express = require('express');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser'); 
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })

var session = require('express-session');

var twitter = require('./twitter');


//key
var SESSION_SECRET = process.env.SESSION_SECRET;

var app = express();
var server = http.createServer(app);

app.engine('ejs',ejs.renderFile);
app.use(cookieParser());
app.use(bodyParser());
app.use(express.static(__dirname+"/public"));

app.use(session({
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	maxAge: 30 * 60 * 1000 // 30min.
	})
);

app.get('/',function(req,res){
	var ejsStatus = {};
	if(req.session.twitterOAuth){
		ejsStatus['twitterButton'] = ' <b>認証済みです</b> -> <a href="/auth/twitter">別のアカウントでtwitter認証する</a>';
	}else{
		ejsStatus['twitterButton'] = ' -> <a href="/auth/twitter">twitter認証する</a>' ;
	}
	res.render('index.ejs',ejsStatus);
})

app.post('/IconImage',upload.single('image'),function(req,res){
	var ejsStatus = {};
	if(req.body['twitter']){
		 ejsStatus['twitter'] = "<p>twitter : "+ twitter.twitterIconChangeRequest(req)+"</p>";
	}else{
		ejsStatus['twitter'] = "";
		}
		res.render('uploaded.ejs',ejsStatus);	
})

twitter.twitterOauthSetUp(app);

// リッスン
server.listen(process.env.PORT || 3000);
console.log('Listening on port %d in %s mode', server.address().port, app.settings.env);


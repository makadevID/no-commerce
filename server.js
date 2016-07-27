const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const ejsEngine = require('ejs-mate');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const Redis = require('ioredis');
const RedisStore = require('connect-redis')(session);
const secret = require('./config/secret');
const passport = require('passport');
const flash = require('express-flash');

/* Server and DB setup */
const app = express();
const redisClient = new Redis(secret.redis);

redisClient.on('connect', function(err) {
	if(err) {
		console.error(err);
	}
	console.log('Connected to Redis.');
});

mongoose.connect(secret.mongo, function(err) {
	if(err) {
		console.error(err);
	}
	console.log('Connected to MongoDB.');
});

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
	resave: true,
	saveUninitialized: true,
	store: new RedisStore({ client: redisClient }),
	secret: secret.secretKey
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.engine('ejs', ejsEngine);
app.set('view engine', 'ejs');

/* Local variable */
app.use(function(req, res, next) {
	res.locals = {
		isAuthenticated: !!req.user,
		auth_user: req.user,
		error: req.flash('error'),
		success: req.flash('success')
	}
	next();
});

// Router
const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);

app.listen(secret.port, (err) => {
	if(err) {
		console.error(err);
	}
	console.log(`Server is listening on http://localhost:${secret.port}`);
})
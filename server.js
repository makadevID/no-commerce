const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const ejsEngine = require('ejs-mate');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const secret = require('./config/secret');

const app = express();

mongoose.connect(secret.database, function(err) {
	if(err) {
		console.error(err);
	}
	console.log('Connected to database.');
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
	secret: secret.secretKey
}));
app.use(flash());
app.engine('ejs', ejsEngine);
app.set('view engine', 'ejs');

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
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

passport.use('local-login', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true,
}, function(req, email, password, done) {
	User.findOne({ email: email }, function(err, user) {
		if(err) {
			return done(err);
		}

		if(!user) {
			return done(err, false, req.flash('errors', 'User not found!'));
		}
	
		user.comparePassword(password, function(err, isMatch) {
			if(!isMatch) {
				return done(err, false, req.flash('errors', `Oops! Password didn't match!`));
			}
			return done(null, user);
		});
	})
}))

exports.isAuthenticated = function(req, res, next) {
	if(req.isAuthenticated) {
		return next();
	}

	return res.redirect('/login');
}
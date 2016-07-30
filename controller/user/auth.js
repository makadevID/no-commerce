const passport = require('passport');
const User = require('../../database/models/user');
const passportConf = require('../../config/passport');

exports.getLogin = function(req, res) {
	if(req.user) {
		return res.redirect('/');
	}

	return res.render('user/auth/login');
}

exports.postLogin = passport.authenticate(
	'user', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}
);

exports.getLogout = function(req, res) {
	req.logout();
	return res.redirect('/');
}

exports.getSignup = function(req, res) {
	return res.render('user/auth/signup');
}

exports.postSignup = function(req, res, next) {
	const { email, password, name } = req.body;

	const user = new User();
	user.email = email;
	user.password = password;
	user.profile.name = name;

	User.findOne({ email: email })
		.exec(function(err, exists) {
			if(exists) {
				req.flash('error', 'Email already exists.')
				return res.redirect('/signup');
			}

			user.save(function(err) {
				if(err) {
					return next(err);
				}
				req.logIn(user, function(err) {
					if(err) {
						return next(err);
					}
					req.flash('success', 'Thank you for registering.');
					return res.redirect('/');
				})
			})
		});
}

exports.getProfile = function(req, res) {
	return res.render('user/auth/profile');
}

exports.getEditProfile = function(req, res) {
	return res.render('user/auth/edit-profile');
}

exports.postEditProfile = function(req, res, next) {
	const { email, name, address } = req.body;
	User.findOne({ _id: req.user._id })
		.exec(function(err, user) {
			if(err) {
				return next(err);
			}
			
			if(email) {
				user.email = email;
			}

			if(name) {
				user.profile.name = name;
			}

			if(address) {
				user.profile.address = address;
			}

			user.save(function(err) {
				if(err) {
					return next(err);
				}
				req.flash('success', 'Your profile has been updated!');

				return res.redirect('/edit-profile');
			});
		});
}
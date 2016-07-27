const { Router } = require('express');
const User = require('../models/user');
const passport = require('passport');
const passportConf = require('../config/passport');

const router = Router();

/* Login & Logout */
router.get('/login', function(req, res) {
	if(req.user) {
		return res.redirect('/');
	}

	return res.render('accounts/login');
})

router.post('/login',
	passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	})
);

router.get('/logout', function(req, res) {
	req.logout();
	return res.redirect('/');
});

/* SignUp */
router.get('/signup', function(req, res) {
	return res.render('accounts/signup');
});

router.post('/signup', function(req, res, next) {
	const { email, password, name } = req.body;

	const user = new User();
	user.email = email;
	user.password = password;
	user.profile.name = name;

	User.findOne({ email: email }, function(err, exists) {
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
});

/* Profile */
router.get('/profile', function(req, res) {
	return res.render('accounts/profile');
});

module.exports = router;

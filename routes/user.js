const { Router } = require('express');
const User = require('../models/user');
const passport = require('passport');
const passportConf = require('../config/passport');

const router = Router();

/* Login */
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

/* SignUp */
router.get('/signup', function(req, res) {
	return res.render('accounts/signup');
});

router.post('/signup', function(req, res) {
	const { email, password, name } = req.body;

	const user = new User();
	user.email = email;
	user.password = password;
	user.profile.name = name;

	User.findOne({ email: email }, function(err, exists) {
		if(exists) {
			req.flash('errors', 'Email already exists.')
			return res.redirect('/signup');
		}

		user.save(function(err) {
			if(err) {
				return next(err);
			}
			return res.redirect('/');
		})
	});
});

/* Profile */
router.get('/profile', function(req, res) {
	return res.render('accounts/profile');
});

module.exports = router;

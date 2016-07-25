const { Router } = require('express');
const User = require('../models/user');

const router = Router();

router.get('/signup', function(req, res) {
	return res.render('accounts/signup', {
		errors: req.flash('errors')
	});
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

module.exports = router;

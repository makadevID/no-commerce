const Category = require('../database/models/category');

exports.isAuthenticated = function(req, res, next) {
	if(req.user) {
		return next();
	}

	return res.redirect('/login');
}

exports.localVariables = function(req, res, next) {
	res.locals = {
		isAuthenticated: !!req.user,
		auth_user: req.user,
		error: req.flash('error'),
		success: req.flash('success')
	}

	next();
}

exports.categories = function(req, res, next) {
	Category.find({})
		.exec(function(err, categories) {
			if(err) {
				return next(err);
			}
			res.locals.categories = categories;
			next();
		});
}
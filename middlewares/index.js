const Category = require('../database/models/category');

exports.notFound = function(req, res) {
	return res.status(404).send('404');
}

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

exports.badge = function(req, res, next) {
	const cart = req.session.cart;
	req.session.cart_count = 0;
	res.locals.wishlist_count = 0;

	let qty = 0;
	for (var i in cart) {
		qty += parseInt(cart[i].quantity);
	}

	req.session.cart_count = qty;
	res.locals.cart_count = qty;

	if(req.user) {
		res.locals.wishlist_count = req.user.wishlist.length;
	}
	
	next();
}
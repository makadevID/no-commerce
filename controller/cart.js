const async = require('async');
const stripe = require('stripe')('sk_test_MPrN0ECFFthwPwpFt40pOU9O');
const Product = require('../database/models/product');
const User = require('../database/models/user');

exports.getCart = function(req, res, next) {
	const { cart, cart_count } = req.session;

	if(!cart_count) {
		req.flash('error', 'Cart is empty.')
		return res.redirect('back');
	}
	const displayCart = { items: [], total: 0 };

	for (var i in cart) {
		displayCart.items.push(cart[i]);
		displayCart.total += parseInt(cart[i].quantity) * parseInt(cart[i].price);
	}

	return res.render('main/cart', { carts: displayCart });
}

exports.postCart = function(req, res) {
	req.session.cart = req.session.cart || {};
	const cart = req.session.cart;
	const { product } = req.params;

	const addTocart = function(cb) {
		Product.findOne({ _id: product })
			.exec(function(err, item) {
				if(err) {
					return cb(err);
				}
				const { _id, name, price, image } = item;

				if(cart[_id]) {
					cart[_id].quantity++;
				} else {
					cart[_id] = { _id, name, image, price, quantity: 1  };
				}
				return cb(null, item);
			});
	}

	const removeInWishlist = function(item, cb) {
		User.findOne({ _id: req.user._id, wishlist: product })
			.exec(function(err, user) {
				if(err) {
					return cb(err);
				}
				if(user) {
					user.wishlist.pull(item._id);
					user.save();
				}
				return cb(null, user);
			});
	}

	async.waterfall([ addTocart, removeInWishlist ], function(err, result) {
		req.flash('success', 'Product added to cart.');
		return res.redirect('back');
	});
}

exports.removeItem = function(req, res) {
	req.session.cart = req.session.cart || {};
	const cart = req.session.cart;
	const { product } = req.params;

	delete cart[product];
	return res.redirect('back');
} 

exports.getCheckout = function(req, res) {
	if(!req.session.cart) {
		req.flash('error', 'Cart is empty');
		return res.redirect('/');
	}

	if(!req.user) {
		return res.redirect('/login?redirect=checkout');
	}

	const cart = req.session.cart || {};
	const count = req.session.cart_count;
	const displayCart = { items: [], total: 0 };

	for (var i in cart) {
		displayCart.items.push(cart[i]);
		displayCart.total += parseInt(cart[i].quantity) * parseInt(cart[i].price);
	}

	return res.render('main/checkout', { carts: displayCart });
}

exports.postPayment = function(req, res, next) {
	const { stripeToken, charges } = req.body;
	const cart = req.session.cart;

	stripe.customers.create({
		source: stripeToken
	})
	.then(function(customer) {
		return stripe.charges.create({
			amount: Math.round(charges * 100),
			currency: 'usd',
			customer: customer.id
		});
	})
	.then(function(charge) {
		User.findOne({ _id: req.user._id })
			.exec(function(err, user) {
				if(err) {
					return next(err);
				}
				for (var i in cart) {
					user.history.push({
						item: cart[i]._id,
						paid: parseInt(cart[i].price) * parseInt(cart[i].quantity),
						date: Date.now()
					});
				}
				user.save();
			});
	});

	req.session.cart = {};
	req.session.thankyou = true;
	
	req.flash('success', 'Payment accepted.');
	return res.redirect('/thankyou');	
}

exports.getThankyou = function(req, res) {
	if(!req.session.thankyou) {
		return res.redirect('/');
	}

	req.session.thankyou = false;
	return res.render('main/thankyou');
}
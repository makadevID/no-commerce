const async = require('async');
const passport = require('passport');
const User = require('../database/models/user');
const passportConf = require('../config/passport');

exports.getLogin = function(req, res) {
	let destination = req.query.redirect || '/';

	if(req.user) {
		return res.redirect('/');
	}

	return res.render('auth/login', { destination });
}

exports.postLogin = function(req, res, next) {
	const { destination } = req.body;
  passport.authenticate('user', function(err, user, info) {
    if (err) {
    	return next(err);
    }
    if (!user) {
    	return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) {
      	return next(err);
      }
      return res.redirect(destination);
    });
  })(req, res, next);
}

exports.getLogout = function(req, res) {
	req.logout();
	return res.redirect('/');
}

exports.getSignup = function(req, res) {
	return res.render('auth/signup');
}

exports.postSignup = function(req, res, next) {
	const { email, password, name } = req.body;

	const user = new User();
	user.email = email;
	user.password = password;
	user.profile.name = name;

	User.count({ email: email })
		.exec(function(err, exists) {
			if(exists) {
				req.flash('error', 'Email already exists.');
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
	return res.render('auth/profile');
}

exports.getEditProfile = function(req, res) {
	return res.render('auth/edit-profile');
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

exports.getHistory = function(req, res, next) {
	User.findOne({ _id: req.user._id })
		.populate('history.item')
		.exec(function(err, user) {
			if(err) {
				return next(err);
			}
			const history = user.history;
			return res.render('auth/history', { history });
		});
}

exports.postWishlist = function(req, res, next) {
	const { product } = req.params;
	
	if(!product) {
		return next();
	}

	const find = { _id: req.user._id };
	const update = { $addToSet: { wishlist: product } };
	const options = { upsert: true, new: true };

	User.findOneAndUpdate(find, update, options, function(err, user) {
		if(err) {
			return next(err);
		}
		user.save(function(err) {
			if(err) {
				req.flash('error', 'Product already in wishlist.');
			}
			req.flash('success', 'Added to wishlist.');
			return res.redirect('back');
		});
	});
}

exports.removeProductFromWishlist = function(req, res, next) {	
	const { product } = req.params;
	
	if(!product) {
		return next();
	}

	User.findOne({ _id: req.user._id })
		.exec(function(err, user) {
			if(err) {
				return next(err);
			}
			user.wishlist.pull(product);
			user.save(function(err) {
				if(err) {
					return next(err);
				}
				req.flash('success', 'Product has been removed from wishlist.');
				return res.redirect('back');
			});
		});
}

exports.getWishlist = function(req, res, next) {
	
	if(!req.user.wishlist.length) {
		req.flash('error', 'Wishlist is empty.');
		return res.redirect('/');
	}

	User.findOne({ _id: req.user._id })
		.populate({
			path: 'wishlist',
			populate: {
				path: 'category'
			}
		})
		.exec(function(err, user) {
			if(err) {
				return next(err);
			}
			const wishlist = user.wishlist;
			return res.render('auth/wishlist', { wishlist });
		})
}
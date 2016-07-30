const Product = require('../../database/models/product');

exports.getHome = function(req, res, next) {
	Product.find({})
		.populate('category')
		.sort('-createdAt')
		.exec(function(err, products) {
			if(err) {
				return next(err);
			}
			return res.render('user/main/home', { products });
		});
}

exports.getAbout = function(req, res) {
	return res.render('user/main/about');
}
const async = require('async');
const Category = require('../../database/models/category');
const Product = require('../../database/models/product');

exports.getByCategory = function(req, res, next) {
	const { slug } = req.params;
	
	const category = function(cb) {
		Category.findOne({ slug })
			.exec(function(err, category) {
				if(err) {
					return next(err);
				}
				return cb(null, category);
			});
	}

	const products = function(category, cb) {
		Product.find({ category: category._id })
			.populate('category')
			.sort('-createdAt')
			.exec(function(err, products) {
				if(err) {
					return next(err);
				}
				return res.render('user/main/home', { products });
			});
	}
	async.waterfall([category, products]);
}

exports.getSingleProduct = function(req, res, next) {
	const { slug } = req.params;

	Product.findOne({ slug })
		.populate('category')
		.exec(function(err, product) {
			if(err) {
				return next(err);
			}
			return res.render('user/main/product', { product });
		});
}
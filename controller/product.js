const async = require('async');
const Category = require('../database/models/category');
const Product = require('../database/models/product');

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
				return res.render('main/home', { products });
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
			return res.render('main/product', { product });
		});
}

exports.postSearch = function(req, res) {
	return res.redirect(`/search?q=${req.body.q}`);
}

exports.getSearch = function(req, res, next) {
	const { q } = req.query;

	if(q) {
		Product.esSearch({
			query_string: {
				query: q
			} 
		})
		.then(function(results) {
			const { hits } = results.hits;
			return res.render('main/search-results', { q, hits });
		})
		.catch(function(err) {
			return next(err);
		});
	} else {
		return res.render('main/search');
	}
}
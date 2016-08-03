const async = require('async');
const Category = require('../database/models/category');
const Product = require('../database/models/product');
const User = require('../database/models/user');

exports.getByCategory = function(req, res, next) {
	const { slug, page } = req.params;
	const perPage = 10;
	
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
			.skip( perPage * page )
			.limit(perPage)
			.populate('category')
			.sort('-createdAt')
			.exec(function(err, products) {
				if(err) {
					return next(err);
				}
				Product.find({ category: category._id })
					.count()
					.exec(function(err, count) {
						return res.render('main/home', {
								products,
								page,
								pages: count / perPage
							});
					});
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
	req.session.searches = req.session.searches || [];
	const search = req.session.searches;

	req.session.searches.push(req.body.q);
	return res.redirect(`/search?q=${req.body.q}`);
}

exports.getSearch = function(req, res, next) {
	const { q } = req.query;
	const searches = req.session.searches;

	if(q) {
		Product.esSearch({
			query_string: {
				query: q
			} 
		})
		.then(function(results) {
			const { hits } = results.hits;
			return res.render('main/search-results', { q, hits, searches });
		})
		.catch(function(err) {
			return next(err);
		});
	} else {
		return res.render('main/search', { searches });
	}
}
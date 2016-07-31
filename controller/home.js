const Product = require('../database/models/product');

exports.getHome = function(req, res, next) {

	const perPage = 10;
	const { page } = req.params;

	Product.find({})
		.skip( perPage * page )
		.limit(perPage)
		.populate('category')
		.sort('-createdAt')
		.exec(function(err, products) {
			if(err) {
				return next(err);
			}
			Product.count()
				.exec(function(err, count) {
					console.log(page);
					return res.render('main/home', {
						products,
						page,
						pages: count / perPage
					});
				});
		});
}

exports.getAbout = function(req, res) {
	return res.render('main/about');
}
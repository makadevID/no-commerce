const slug = require('slug');
const Category = require('../../database/models/Category');
const Product = require('../../database/models/Product');

exports.getCategories = function(req, res, next) {
	Category.find({})
		.sort('-createdAt')
		.exec(function(err, categories) {
			if(err) {
				return next(err);
			}

			if(!categories.length) {
				req.flash('error', 'No categories found!');
			}

			return res.render('admin/categories/index', { categories });
		});
}

exports.getCreateCategory = function(req, res) {
	return res.render('admin/categories/create');
}

exports.postCreateCategory = function(req, res, next) {
	const category = new Category();
	
	category.name = req.body.name;
	category.slug = slug(req.body.name);

	category.save(function(err) {
		if(err) {
			return next(err);
		}

		req.flash('success', 'Category added!');
		return res.redirect('/nc-admin/categories');
	});
}
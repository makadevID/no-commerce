const async = require('async');
const faker = require('faker');
const slug = require('slug');
const Category = require('../models/category');
const Product = require('../models/product');

module.exports = function(cat) {
	const getCategory = function(cb) {
		Category.findOne({ name: cat })
			.exec(function(err, category) {
				if(err) {
					return cb(err);
				}
				return cb(null,category);
			});
	}

	const productCount = function(category, cb) {
		Product.count({ category: category._id }, function(err, count) {
			if(err) {
				return cb(err, null);
			}

			if(count === 0) {
				return cb(null, category, true);
			}			
		});
	}

	const insertProducts = function(category, count, cb) {
		if(count) {
			for (var i = 0; i < 15; i++) {
				const product = new Product();

				product.category = category._id;
				product.name = faker.commerce.productName();
				product.slug = slug(product.name);
				product.price = faker.commerce.price();
				product.image = faker.image.image();

				product.save();
			}
			return cb(null, true);
		}
	}

	async.waterfall(
		[getCategory, productCount, insertProducts],
		function(err, inserted) {
			if(inserted) {
				console.log('Product has been seeded.');
			}
		}
	);
}
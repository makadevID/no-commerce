const faker = require('faker');
const Category = require('../models/category');

module.exports = function(category) {
	Category.count({}, function(err, count) {
		if(count > 0) {
			return;
		}

		const data = [
			{ name: 'T-shirt', slug: 't-shirt' },
			{ name: 'Pants', slug: 'pants' },
			{ name: 'Long Pants', slug: 'long-pants' },
			{ name: 'Shoes', slug: 'shoes' },
			{ name: 'Bag', slug: 'bag' },
			{ name: 'Accessories', slug: 'accessories' },
			{ name: 'Watch', slug: 'watch' },
		];

		Category.collection.insert(data, function(err, docs) {
			if(err) {
				console.error('Error while seeding categories.');
			}
			console.log(`%s categories inserted.`, docs.insertedCount);
		});

	});
}
const mongoose = require('mongoose');
const mexp = require('mongoose-elasticsearch-xp');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	category: {	type: Schema.Types.ObjectId, ref: 'Category' },
	name: String,
	slug: { type: String, unique: true, lowercase: true },
	price: Number,
	image: String
});

ProductSchema.plugin(mexp);

const Product = mongoose.model('Product', ProductSchema);

Product.on('es-bulk-sent', function () {
  console.log('Synchronize product starting.');
});

Product.on('es-bulk-error', function (err) {
  console.error(err);
});

Product.esSynchronize()
  .then(function () {
    console.log('Synchronize product finished.');
  });

module.exports = Product;

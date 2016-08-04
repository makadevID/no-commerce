const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const bcrypt = require('bcrypt-nodejs');
const Category = require('./category').CategorySchema;

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category',
		es_schema: Category,
		es_indexed: true,
		es_select: 'name'
	},
	name: { type: String, es_indexed: true },
	slug: { type: String, unique: true, lowercase: true, es_indexed: true },
	price: { type: Number, es_indexed: true },
	image: { type: String, es_indexed: true }
});

ProductSchema.plugin(mongoosastic, {
	populate: [
		{ path: 'category', select: 'name slug' }
	]
});

const Product = mongoose.model('Product', ProductSchema);

/* Indexing an Existing collection */
const stream = Product.synchronize();
let count = 0;

stream.on('data', function () {
	count++;
});

stream.on('close', function(){
  console.log('Indexed ' + count + ' documents!');
});

stream.on('error', function (err) {
  console.error(err);
});

module.exports = Product;

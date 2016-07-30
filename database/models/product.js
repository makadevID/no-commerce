const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	category: { type: Schema.Types.ObjectId, ref: 'Category' },
	name: String,
	slug: { type: String, unique: true, lowercase: true },
	price: Number,
	image: String
});

module.exports = mongoose.model('Product', ProductSchema);
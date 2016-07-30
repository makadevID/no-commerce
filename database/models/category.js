const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
	name: { type: String, unique: true },
	slug: { type: String, unique: true, lowercase: true }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
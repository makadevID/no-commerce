const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
	email: { type: String, unique: true, lowercase: true },
	password: String,
	profile: {
		name: { type: String, default: '' },
		address: String,
		picture: { type: String, default: '' }
	}, 
	history: [{
		date: Date,
		paid: { type: Number, default: 0 },
		item: { type: Schema.Types.ObjectId, ref: 'Product' }
	}],
	wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product', unique: true }],
	searches: [{ type: String, unique: true }]
}, { timestamps: true });

UserSchema.pre('save', function(next) {
	const user = this;

	if(!user.isModified('password')) {
		return next();
	}

	bcrypt.genSalt(10, function(err, salt) {
		if(err) {
			return next(err);
		}

		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if(err) {
				return next(err);
			}

			user.password = hash;
			return next();
		});
	})
});

UserSchema.methods.comparePassword = function(password, cb) {
	bcrypt.compare(password, this.password, function(err, res) {
		if(err) {
			return cb(err);
		}

		return cb(null, res);
	});
}

module.exports = mongoose.model('User', UserSchema);
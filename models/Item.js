const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
	invoice_id: {
		type: String
	},
	name: {
		type: String
	},
	quantity: {
		type: Number,
		default: 1
	},
	amount: {
		type: Number
	},
	priority: {
		type: Number
	}
});

module.exports = Item = mongoose.model('item', ItemSchema);

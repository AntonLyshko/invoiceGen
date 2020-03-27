const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
	invoice_id: {
		type: String,
		require: true
	},
	order_id: {
		type: String,
		unique: true,
		require: true
	},
	currency: {
		type: String,
		default: null
	},
	is_vat: {
		type: Boolean,
		default: false
	},
	issue_date: {
		type: Date,
		default: null
	},
	customer_address: {
		type: String,
		default: null
	},
	delivery_address: {
		type: String,
		default: null
	},
	payment_reference: {
		type: String,
		default: null
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	update_at: {
		type: Date,
		default: null
	}
});

module.exports = Invoice = mongoose.model('invoice', InvoiceSchema);

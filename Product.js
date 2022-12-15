const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: {
		type: 'string',
		required: [true, 'Name is required'],
		minlength: [3, 'Name must be at least 3 characters'],
		maxlength: [50, 'Name must be at most 50 characters'],
	},
	price: {
		type: 'number',
		required: [true, 'Price is required'],
		min: [1000, 'Price must be at least 1000'],
		max: [1000000, 'Price must be at most 1000000'],
	},
	stock: {
		type: 'number',
		required: [true, 'Stock is required'],
		min: [0, 'Stock must be at least 0'],
		max: [1000, 'Stock must be at most 1000'],
	},
	status: {
		type: 'boolean',
		default: true,
	},
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

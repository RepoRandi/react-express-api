const mongoose = require('mongoose');

mongoose.connect(
	'mongodb://randi:123456@localhost:27017/exercise?authSource=admin',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
	},
	price: {
		type: Number,
		required: true,
		min: 1000,
		max: 1000000,
	},
	stock: Number,
	status: { type: Boolean, default: true },
});

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
	},
	email: {
		type: String,
		validate: {
			validator: function (v) {
				return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
			},
			message: (props) => `${props.value} is not a valid email!`,
		},
		required: true,
	},
	password: String,
});

const Product = mongoose.model('Product', productSchema);

const User = mongoose.model('User', userSchema);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', async () => {
	try {
		const products = await Product.find({
			status: true,
		});
		console.log(products);

		const product = await Product.findById('6252913ce942c4e1f3ae5b5e');
		console.log(product);

		try {
			const newProduct = await Product.create({
				name: 'Product 99',
				price: 1000,
			});
			console.log(newProduct);
		} catch (error) {
			console.log(error.message);
		}

		const updateProduct = await Product.findById(
			'6252913ce942c4e1f3ae5b5e'
		);

		updateProduct.name = 'Product update';
		updateProduct.price = 200000;
		updateProduct.stock = 10;
		updateProduct.status = true;

		const update = await updateProduct.save();

		console.log(update);

		const productId = await Product.findById('6252913ce942c4e1f3ae5b5e');

		if (productId != null) {
			await Product.deleteOne(productId);
			console.log('delete success');
		} else {
			console.log('delete failed');
		}

		try {
			const newUser = await User.create({
				username: 'jack',
				email: 'jack@gmail.com',
				password: '123456',
			});
			console.log(newUser);
		} catch (error) {
			console.log(error.message);
		}

		const list_products = await Product.find()
			.select('name stock')
			.where({ stock: { $gte: 5 } })
			.limit(3)
			.sort({ stock: -1 })
			.exec();
		console.log(list_products);
	} catch (error) {
		console.log(error);
	}
});

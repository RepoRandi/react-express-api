const express = require('express');
const path = require('path');
const routers = express.Router();
const multer = require('multer');
require('./connection');
const ObjectId = require('mongodb').ObjectID;
const Product = require('./Product');

const imageFilter = (_req, file, cb) => {
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
		return cb(null, false);
	}
	cb(null, true);
};

const upload = multer({ dest: 'public', fileFilter: imageFilter });
const fs = require('fs');

routers.get('/', (_req, res) => res.send('Hello World!'));

routers.get('/post/:id?', (req, res) => {
	if (req.params.id) res.send('artikel-' + req.params.id);
});

routers.post('/login', (req, res) => {
	const { username, password } = req.body;
	res.send(`Anda login dengan username ${username} dan password ${password}`);
});

routers.get('/download', function (_req, res) {
	const filename = 'logo.jpg';
	res.download(path.join(__dirname, filename), 'logo-utama.png');
});

routers.get('/preview-image', function (_req, res) {
	const filename = 'logo.jpg';
	res.sendFile(path.join(__dirname, filename), {
		headers: {
			'Content-Type': 'image/png',
		},
	});
});

routers.post('/upload', upload.single('file'), (req, res) => {
	const file = req.file;
	if (!file) {
		const error = new Error('Please upload a file');
		error.httpStatusCode = 400;
		return next(error);
	} else {
		const target = path.join(__dirname, 'public', file.originalname);
		fs.renameSync(file.path, target);
		res.send('file berhasil diupload');
	}
});

routers.post('/register', upload.single('avatar'), (req, res) => {
	const { username, password } = req.body;
	const avatar = req.file;
	if (!avatar) {
		const error = new Error('Please upload a file');
		error.httpStatusCode = 400;
		return next(error);
	} else {
		const target = path.join(__dirname, 'public', avatar.originalname);
		fs.renameSync(avatar.path, target);
		res.send({
			status: 'success register',
			username: username,
			password: password,
			avatar: avatar,
		});
	}
});

routers.post('/upload-multiple', upload.array('file', 12), (req, res) => {
	const files = req.files;
	res.send(files);
});

var cpUpload = upload.fields([
	{ name: 'avatar', maxCount: 1 },
	{ name: 'gallery', maxCount: 4 },
]);

routers.post('/upload-multiple-fields', cpUpload, (req, res) => {
	const files = req.files;
	res.send(files);
});

routers.get('/products', async (_req, res) => {
	const products = await Product.find();

	if (products.length > 0) {
		res.send({
			status: 'success',
			message: 'List of products found',
			data: products,
		});
	} else {
		res.send({
			status: 'failed',
			message: 'List of products not found',
		});
	}
});

routers.get('/product/:id', async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (product) {
		res.send({
			status: 'success',
			message: 'Product found',
			data: product,
		});
	} else {
		res.send({
			status: 'failed',
			message: 'Product not found',
		});
	}
});

routers.post('/product', multer().none(), async (req, res) => {
	const { name, price, stock, status } = req.body;

	try {
		const product = await Product.create({
			name: name,
			price: price,
			stock: stock,
			status: status,
		});

		if (product) {
			res.send({
				status: 'success',
				message: 'Product created',
				data: product,
			});
		} else {
			res.send({
				status: 'failed',
				message: 'Product not created',
			});
		}
	} catch (error) {
		res.send({
			status: 'failed',
			message: error.message,
		});
	}
});

routers.put('/product/:id', multer().none(), async (req, res) => {
	const { name, price, stock, status } = req.body;
	try {
		const result = await Product.updateOne(
			{ _id: req.params.id },
			{
				name: name,
				price: price,
				stock: stock,
				status: status,
			},
			{ runValidators: true }
		);
		if (result && result.matchedCount == 1) {
			res.send({
				status: 'success',
				message: 'update product success',
				data: result,
			});
		} else {
			res.send({
				status: 'warning',
				message: 'update product gagal',
				data: result,
			});
		}
	} catch (error) {
		res.send({
			status: 'error',
			message: error.message,
		});
	}
});

routers.delete('/product/:id', async (req, res) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);

		if (product) {
			res.send({
				status: 'success',
				message: 'Product deleted',
				data: product,
			});
		} else {
			res.send({
				status: 'failed',
				message: 'Product not deleted',
			});
		}
	} catch (error) {
		res.send({
			status: 'failed',
			message: error.message,
		});
	}
});

module.exports = routers;

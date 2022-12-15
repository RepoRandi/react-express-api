const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const app = express();
const port = 3000;
const url = 'http://localhost';
const routers = require('./routers');

app.get('/', (_req, res) => res.send('Hello World!'));

app.post('/contoh', (_req, res) => {
	res.send('request dengan method POST');
});

app.put('/contoh', (_req, res) => {
	res.send('request dengan method PUT');
});

app.delete('/contoh', (_req, res) => {
	res.send('request dengan method DELETE');
});

app.all('/universal', function (req, res) {
	res.send('request dengan method ' + req.method);
});

app.get('/post/:id', (req, res) => {
	res.send('artikel-' + req.params.id);
});

app.get('/foods', (req, res) => {
	const page = req.query.page ? req.query.page : 1;
	res.write('Foods page: ' + page + '\n');
	req.query.sort && res.write('Sort by: ' + req.query.sort);
	res.end();
});

const log = (req, _res, next) => {
	console.log(`${Date.now()}  ${req.ip}  ${req.originalUrl}`);
	next();
};

const notFound = (_req, res, _next) => {
	res.status(404).json({ status: 'error', message: 'resource not found' });
};

const errorHandling = (_err, _req, res, _next) => {
	res.json({
		status: 'error',
		message: 'terjadi kesalahan pada server',
	});
};

app.use(log);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(routers);
app.use(notFound);
app.use(errorHandling);
app.use(compression());

app.listen(port, () => console.log(`Server running at ${url}:${port}`));

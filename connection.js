const mongoose = require('mongoose');

mongoose.connect(
	'mongodb://randi:123456@localhost:27017/exercise?authSource=admin',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		// useCreateIndex: false,
	}
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
	console.log('Server database connect!');
});

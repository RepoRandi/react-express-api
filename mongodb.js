const MongoClient = require('mongodb').MongoClient;
const connectionString =
	'mongodb://randi:123456@localhost:27017?authSource=admin';

(async () => {
	try {
		const client = await MongoClient.connect(connectionString, {
			useUnifiedTopology: true,
		});
		const db = client.db('exercise');

		// kode query ke collection quotes
		const quotes = await db
			.collection('quotes')
			.find({
				word: /Gitu/,
			})
			.toArray();
		const quote = await db.collection('quotes').findOne();
		console.log(quotes);
		console.log(quote);
	} catch (error) {
		console.error(error);
	}
})();

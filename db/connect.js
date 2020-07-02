const MongoClient = require('mongodb').MongoClient;
const { dbUrl, dbName } = require('../config');

const client = new MongoClient(dbUrl, { useUnifiedTopology: true })

async function connect(cb) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const categories = db.collection('categories');
        cb(categories);
    } catch (e) {
        console.log('error connecting to database', e)
    }
};

module.exports = connect;
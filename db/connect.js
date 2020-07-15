const MongoClient = require("mongodb").MongoClient;
const { dbUrl, dbName } = require("../config");

const client = new MongoClient(dbUrl, { useUnifiedTopology: true });

const connect = new Promise(async (resolve, reject) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    resolve({ db, client });
  } catch (e) {
    console.log("error connecting to database", e);
    reject(e);
  }
});

module.exports = connect;

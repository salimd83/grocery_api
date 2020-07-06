require('dotenv').config();

const dbName = process.env.NODE_ENV === 'test' ? process.env.MONGO_DB_NAME_TEST : process.env.MONGO_DB_NAME;

module.exports = {
    port: process.env.NODE_ENV === 'test' ? 3001 : process.env.PORT,
    dbName,
    dbUrl: process.env.MONGODB_URL + `/${dbName}`
}
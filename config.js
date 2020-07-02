require('dotenv').config();

module.exports = {
    port: process.env.PORT,
    dbName: process.env.MONGO_DB_NAME,
    dbUrl: process.env.MONGODB_URL + `/${process.env.MONGO_DB_NAME}`
}
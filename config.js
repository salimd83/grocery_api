require('dotenv').config();

module.exports = {
    port: process.env.PORT,
    dbName: process.env.MONGO_DB_NAME,
    dbUrl: `mongodb+srv://gsDBAdmin:cy.Dp3GJDOSX@cluster0-qpy92.gcp.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`
}
const express = require('express');
const cors = require('cors');
const connect = require('../db/connect');
const { port } = require('../config');
const categoriesRouter = require('./routes/category');
const categoriesModel = require('./models/categories');
const handleError = require('./error');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send({text: 'Hello from express'})
});

connect(categories => {
    app.use(categoriesRouter(categoriesModel(categories)));
    app.use(handleError);
    app.listen(port, () => console.log('App is listening on port 3000'));
})
const express = require("express");
const cors = require("cors");
const connect = require("../db/connect");
const { server, setRoutes } = require("./setup");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.send({ text: "Hello from express" });
});

if (process.env.NODE_ENV === "test")
  server(app)
else
  connect((categories) => {
    setRoutes(app, categories);
    server(app);
  });

module.exports = app;

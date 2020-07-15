const express = require("express");
const cors = require("cors");
const connect = require("../db/connect");
const { server, setRoutes } = require("./setup");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send({ text: "Hello from express" });
});

if (process.env.NODE_ENV !== "test")
  connect
    .then(({ db }) => {
      setRoutes(app, db);
      server(app);
    })
    .catch((e) => console.log(e));

module.exports = app;

const express = require("express");
const cors = require("cors");
const UserInput = require("./api/UserInput.route.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("*", UserInput);
//app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

module.exports = app;

const express = require("express");
const cors = require("cors");
const UserInput = require("./api/UserInput.route.js");
const CompanyAccount = require("./api/CompanyAccount.route.js");
const bodyParser = require('body-parser')

const app = express();

app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use("/api/v1/QR/*", UserInput);
//app.use("/api/v1/Company", Company);
app.use("/api/v1/Company/Account", CompanyAccount);
//app.use("api/v1/Store/Account", CompanyAccount);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

module.exports = app;

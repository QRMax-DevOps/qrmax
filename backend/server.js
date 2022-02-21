const express = require("express");
const cors = require("cors");
const UserInput = require("./api/UserInput.route.js");
const CompanyAccount = require("./api/CompanyAccount.route.js");
const StoreAccount = require("./api/StoreAccount.route.js");
const Store = require("./api/Store.route.js");
const StoreList = require("./api/StoreList.route.js");
const CompanyStoreList = require("./api/CompanyStoreList.route.js");
const bodyParser = require('body-parser')

const app = express();

app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use("/api/v1/QR", UserInput);
app.use("/api/v1/Company/Account", CompanyAccount);
app.use("/api/v1/Store/Account", StoreAccount);
app.use("/api/v1/Company/Store", Store)
app.use("/api/v1/Store/Account/storesList", StoreList)
app.use("/api/v1/Company/Account/accountList", CompanyStoreList)
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

module.exports = app;

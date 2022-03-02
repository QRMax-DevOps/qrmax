const express = require("express");
const cors = require("cors");
const UserInput = require("./api/route/UserInput.route.js");
const CompanyAccount = require("./api/route/CompanyAccount.route.js");
const StoreAccount = require("./api/route/StoreAccount.route.js");
const Store = require("./api/route/Store.route.js");
const StoreList = require("./api/route/StoreList.route.js");
const CompanyStoreList = require("./api/route/CompanyStoreList.route.js");
const Display = require("./api/route/Display.route.js");
const QR = require("./api/route/QR.route.js");
const bodyParser = require('body-parser')

const app = express();

app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({
    extended: true
  }));

//User input
app.use("/api/v1/QR", UserInput);

//account management
app.use("/api/v1/Company/Account", CompanyAccount);
app.use("/api/v1/Store/Account", StoreAccount);

//store management
app.use("/api/v1/Company/Store", Store)
app.use("/api/v1/Company/Account/accountList", CompanyStoreList)

//store account - store management
app.use("/api/v1/Store/Account/storesList", StoreList)

//display management
app.use("/api/v1/Display", Display);

//media management
app.use("/api/v1/Media", QR);


app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

module.exports = app;

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
const Media = require("./api/route/media.route.js");
const Listen = require("./api/route/listen.route.js");
const CompanyAccountSettings = require("./api/route/CompanyAccountSettings.route.js");
const StoreAccountSettings = require("./api/route/StoreAccountSettings.route.js");
const DisplaySettings = require("./api/route/DisplaySettings.route.js");
const Interactions = require("./api/route/Interactions.route.js");
const MediaRefresh = require("./api/route/MediaRefresh.route.js");
const Positions = require("./api/route/QRPositions.route.js");
const baseMedia = require("./api/route/baseMedia.route.js");
const bodyParser = require('body-parser');

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
app.use("/api/v1/Display/Media", QR);
app.use("/api/v1/Display/Media/file", Media);
app.use("/api/v1/Display/Media/positions", Positions);

//display listen
app.use("/api/v1/Display/media/listen", Listen);

//Company account settings
app.use("/api/v1/Company/Account/Settings", CompanyAccountSettings);

//Store account settings
app.use("/api/v1/Store/Account/Settings", StoreAccountSettings);

//Display settings
app.use("/api/v1/Display/Settings", DisplaySettings);

//Media interactions
app.use("/api/v1/Display/Interactions", Interactions);

//Display QR refresh
app.use("/api/v1/Display/Media/Refresh", MediaRefresh);

//display base media
app.use("/api/v1/Display/Media/baseMedia", baseMedia);

app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

module.exports = app;

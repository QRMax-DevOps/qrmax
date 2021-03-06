const express = require('express')
const cors = require("cors");
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const {
  clearDB,
  refreshAllQR,
  deleteAllUserInput
} = require('./middleware/cronJobs');
//const port = process.env.PORT || 5000
const port = 4200

connectDB()

const app = express()

app.use(express.json({limit: '200mb'}));
app.use(express.urlencoded({limit: '200mb'}));
//app.use(express.json({limit:'200mb'}));
//app.use
//app.use(cors({
//  origin: '*'
//}));
//const bodyParser = require('body-parser')
//app.use(bodyParser.json({ limit: '200mb' }));
//app.use(bodyParser.urlencoded({ limit: '200mb', extended: true, parameterLimit:50000 }));

//User input
app.use("/api/v2/QR", require('./routes/QRRoutes'));

//Company Account
app.use("/api/v2/Company", require('./routes/companyRoutes'));

//Store Account
app.use("/api/v2/Store", require('./routes/storeRoutes'));

//Displays
app.use("/api/v2/Display", require('./routes/displayRoutes'));

//Defaul 404 not found
app.use("*", (req, res) => res.status(404).json({ error: "endpoint not found" }));

//start cron jobs
//refreshAllQR();
//deleteAllUserInput();
//clearDB();

app.listen(port, () => console.log(`Server started on port ${port}`))

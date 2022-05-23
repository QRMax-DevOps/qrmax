const express = require('express')
const cors = require("cors");
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const {
  refreshAllQR,
  deleteAllUserInput
} = require('./middleware/cronJobs');
//const port = process.env.PORT || 5000
const port = 80

connectDB()

const app = express()

app.use(express.json())
app.use(cors());
const bodyParser = require('body-parser')
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

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
refreshAllQR();
deleteAllUserInput();

app.listen(port, () => console.log(`Server started on port ${port}`))

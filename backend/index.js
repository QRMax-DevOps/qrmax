const app = require("./server.js");
const mongodb = require("mongodb");
const dotenv = require("dotenv");
const UserInputDAO = require("./dao/UserInputDAO.js");
const CompanyAccountDAO = require("./dao/CompanyAccountDAO.js");
const StoreAccountDAO = require("./dao/StoreAccountDAO.js");
const CompanyDAO = require("./dao/CompanyDAO.js");
const DisplayDAO = require("./dao/DisplayDAO.js");
const MediaDAO = require("./dao/MediaDAO.js");

dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 80;

MongoClient.connect(process.env.QRMAX_DB_URI, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
  useNewUrlParser: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await UserInputDAO.injectDB(client);
    await CompanyAccountDAO.injectDB(client);
    await StoreAccountDAO.injectDB(client);
    await CompanyDAO.injectDB(client);
    await MediaDAO.injectDB(client);
    await DisplayDAO.injectDB(client);

    
    app.listen(port, () => {
      console.log("listening on port ", port);
    });
  });

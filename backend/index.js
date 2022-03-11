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


//TODO: find way to ensure this all happens before the DisplayDao loop is run
MongoClient.connect(process.env.QRMAX_DB_URI, {
  maxPoolSize: 50,
  wtimeoutMS: 15000,
  useNewUrlParser: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    UserInputDAO.injectDB(client);
    CompanyAccountDAO.injectDB(client);
    StoreAccountDAO.injectDB(client);
    CompanyDAO.injectDB(client);
    MediaDAO.injectDB(client);
    DisplayDAO.injectDB(client);

    app.listen(port, () => {
      console.log("listening on port ", port);
    });
  });
 

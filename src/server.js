const express = require("express");
const app = express();
const connect = require("./utils/db");
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// make env file can be accessed from process.env
require("dotenv").config();

// routes
require("./resources/router")(app);

const startServer = async () => {
  const database =
    process.env.NODE_ENV === "test"
      ? process.env.TEST_DATABASE
      : process.env.DATABASE;
  await connect(database);
  const server = await app.listen(port, () => console.log(`Server Running at http://localhost:${port}`));
  return server;
};

module.exports = startServer;

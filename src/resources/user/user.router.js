const { login, createAccount } = require("./user.controller");

const userRouters = app => {
    app.post ('/login', [], login);
    app.post ('/create-account', [], createAccount);
  };
  
  module.exports = userRouters;
  
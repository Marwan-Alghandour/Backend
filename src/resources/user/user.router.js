const { login } = require("./user.controller");

const userRouters = app => {
    app.post ('/login', [], login);
  };
  
  module.exports = userRouters;
  
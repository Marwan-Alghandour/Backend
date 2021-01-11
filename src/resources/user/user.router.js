const { login, createAccount, getCourses } = require("./user.controller");

const userRouters = app => {
  app.get("/me", [], getCourses)
  app.post('/login', [], login);
  app.post('/create-account', [], createAccount);
};

module.exports = userRouters;

const mainRouter = require ('./main/main.router');

const routers = app => {
    mainRouter(app);
};

module.exports = routers;

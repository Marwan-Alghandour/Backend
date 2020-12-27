const mainRouter = require ('./main/main.router');
const userRouter = require('./user/user.router');

const routers = app => {
    mainRouter(app);
    userRouter(app);
};

module.exports = routers;

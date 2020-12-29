const mainRouter = require('./main/main.router');
const userRouter = require('./user/user.router');
const courseRouter = require('./courses/course.router');

const routers = app => {
    mainRouter(app);
    userRouter(app);
    courseRouter(app);
};

module.exports = routers;

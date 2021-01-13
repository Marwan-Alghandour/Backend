const mainRouter = require('./main/main.router');
const userRouter = require('./user/user.router');
const courseRouter = require('./courses/course.router');
const quizRouter = require("./quizes/quiz.router");
const annRouter = require("./announcement/announcement.router");

const routers = app => {
    mainRouter(app);
    userRouter(app);
    courseRouter(app);
    quizRouter(app);
    annRouter(app);
};

module.exports = routers;

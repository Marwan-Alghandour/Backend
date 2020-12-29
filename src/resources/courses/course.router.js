const { create_course } = require("./course.controller");

const courseRouter = app => {
    app.post('/create-course', [], create_course);
};

module.exports = courseRouter;

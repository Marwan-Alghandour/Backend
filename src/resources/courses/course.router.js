const { create_course, take_content } = require("./course.controller");

const courseRouter = app => {
    app.post('/create-course', [], create_course);
};

const courseUpdateRouter = app => {
    app.post('/update-course', [], take_content);
};

module.exports = courseRouter;

module.exports = courseUpdateRouter;

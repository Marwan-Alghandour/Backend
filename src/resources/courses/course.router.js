const { get_courses, create_course, take_content } = require("./course.controller");

const courseRouter = app => {
    app.get("/courses", [], get_courses);
    app.post('/create-course', [], create_course);
    app.post('/update-course', [], take_content);
};

module.exports = courseRouter;


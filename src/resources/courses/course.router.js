const { create_course, take_content, get_users_in_course } = require("./course.controller");

const courseRouter = app => {
    app.post('/create-course', [], create_course);
    app.post('/update-course', [], take_content);
    app.get("/users/:course_id", [], get_users_in_course);
};

module.exports = courseRouter;


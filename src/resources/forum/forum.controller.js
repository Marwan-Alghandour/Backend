const jwt = require("jsonwebtoken");
const { Course } = require("../courses/course.model");

async function get_discussion(req, res) {
    const token = req.headers.token;
    if (!token) return res.status(401).send({ message: "Forbidden" });

    const payload = jwt.verify(token, process.env.APP_KEY);
    if (!payload) return res.status(401).send({ message: "Forbidden" });

    const course_id = req.params.courseID;
    try {
        let course = await Course.findById(course_id).populate({
            path: "questions",
            populate: [{
                path: "comments",
                populate: {
                    path: "author"
                }
            }, {
                path: "author"
            }]
        }).exec();

        if (!course) return res.status(404).send({ message: "Course not found" });
        res.send({
            message: "Success",
            questions: course.questions
        });
    } catch (e) {
        return res.status(500).send({ message: e.message });
    }
}

module.exports = { get_discussion }
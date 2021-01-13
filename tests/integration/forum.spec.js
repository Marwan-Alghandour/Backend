const { Course } = require("../../src/resources/courses/course.model");
const { User } = require("../../src/resources/user/user.model");

const bcrypt = require("bcrypt");

const request = require("supertest");
const { Question, Comment } = require("../../src/resources/forum/forum.model");
require("dotenv").config();
var server;
var student_token;
var course_id;
var user_id;

describe("Assignment", () => {

    beforeAll(async done => {
        server = await require("../../app.js");
        const hash = await bcrypt.hash("mypassword", 10);

        const user = new User({
            username: "username2",
            email: "user2@example.com",
            role: "student",
            password: hash
        });
        student_token = user.generateAuthToken();
        await user.save();

        user_id = user._id;

        let course = new Course({
            name: "Course1",
            code: "CSE101",
            credit_hours: 3,
        });

        await course.save();
        course_id = course._id;

        const question = new Question({
            course: course_id,
            body: "mo7annak question",
            author: user_id
        });

        await question.save();

        const comment = new Comment({
            question: question._id,
            author: user._id,
            body: "mo7annak comment"
        });
        await comment.save();

        await Question.findByIdAndUpdate(question._id, { $push: { comments: comment._id } }, { new: true, useFindAndModify: false })
        await Course.findByIdAndUpdate(course_id, { $push: { users: user_id, questions: question.id } }, { new: true, useFindAndModify: false })
        await User.findByIdAndUpdate(user_id, { $push: { courses: course_id } }, { new: true, useFindAndModify: false })
        done();
    });

    afterAll(async done => {
        await Course.deleteMany({});
        await User.deleteMany({});
        await Question.deleteMany({});
        server.close();
        done();
    });

    describe("create-assignment", () => {
        it("should return 200 and save assignment to db", async () => {
            console.log(course_id);
            const res = await request(server).get(`/forum/${course_id}`)
                .set("token", student_token)
                .send();

            expect(res.body.message).toBe("Success");
            expect(res.status).toBe(200);
            expect(res.body.questions).toHaveLength(1);
            expect(res.body.questions[0].body).toBe("mo7annak question");
            expect(res.body.questions[0].comments).toHaveLength(1);
            expect(res.body.questions[0].comments[0].body).toBe("mo7annak comment");
        });
    });

});


const { Course } = require("../../src/resources/courses/course.model");
const { Assignment } = require("../../src/resources/assignments/assignment.model");
const { User } = require("../../src/resources/user/user.model");

const bcrypt = require("bcrypt");

const request = require("supertest");
require("dotenv").config();
var server;
var teacher_token;
var student_token;
var course_id;
var user_id;

describe("Assignment", () => {

    beforeAll(async done => {
        server = await require("../../app.js");
        const hash = await bcrypt.hash("mypassword", 10);
        let user = new User({
            username: "username1",
            email: "user1@example.com",
            role: "teacher",
            password: hash
        });
        teacher_token = user.generateAuthToken();
        await user.save();


        user = new User({
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

        await Course.findByIdAndUpdate(course_id, { $push: { users: user_id } }, { new: true, useFindAndModify: false })
        await User.findByIdAndUpdate(user_id, { $push: { courses: course_id } }, { new: true, useFindAndModify: false })

        const assignment = new Assignment({
            course: course_id,
            descreption: "some assignment to make your life a bit worse",
            url: "https://drivelink.com",
            title: "Assignment 1",
            deadline: new Date()
        });

        await assignment.save();
        assignment_id = assignment._id;
        done();
    });

    afterAll(async done => {
        await Course.deleteMany({});
        await User.deleteMany({});
        server.close();
        done();
    });

    describe("create-assignment", () => {
        it("should return 200 and save assignment to db", async () => {
            const res = await request(server).post("/create-assignment")
                .set("token", teacher_token)
                .send({
                    course_code: "CSE101",
                    assignment: {
                        descreption: "some assignment so you hate me even more",
                        url: "someurl.com",
                        deadline: new Date(),
                        title: "Assignment 1"
                    }
                });

            expect(res.body.message).toBe("Assignment Created successfully");
            expect(res.status).toBe(200);
        });
    });

    describe("submit-assignment/assignment-id", () => {
        it("should submit the assignment data and return the grad", async () => {
            let res = await request(server).post(`/submit-assignment/${assignment_id}`)
                .set("token", student_token)
                .send({
                    url: "https://ass-submission-url.com"
                });

            expect(res.body.message).toBe("Success");
            expect(res.status).toBe(200);

            const a = await Assignment.findById(assignment_id).populate("users_taken").exec();
            expect(a.users_taken).toHaveLength(1);
            expect(a.users_taken[0].username).toBe("username2");

        });
    });
});


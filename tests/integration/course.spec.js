const { Course } = require("../../src/resources/courses/course.model");
const { User } = require("../../src/resources/user/user.model");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();
var server;
var token;
var course_id;

describe("test user authentication", () => {

    beforeAll(async done => {
        server = await require("../../app.js");
        done();
    })


    afterAll(done => {
        server.close();
        done();
    });

    describe("/create-course", () => {
        beforeAll(done => {
            token = jwt.sign({
                user_id: "someid",
                username: "adminuser",
                email: "admin.example.com",
                role: "admin"
            }, process.env.APP_KEY)
            done();
        });

        afterEach(async (done) => {
            await Course.deleteMany({});
            await User.deleteMany({});
            done();
        });

        it("should return 200 and should create course in database", (done) => {

            request(server).post("/create-course")
                .set("token", token)
                .send({
                    name: "Course one",
                    code: "CSE156",
                    profs: ["Ashraf Salem", "Wathiq El-Qorashy"],
                    TAs: ["Ahmed my heart"],
                    credit_hours: 3,
                }).then(res => {
                    expect(res.body.message).toBe("Course 'Course one' was created successfully");
                    expect(res.status).toBe(200);
                    done();
                }).catch(e => {
                    console.log(e);
                })
        });
    });

    describe("/update-course", () => {
        beforeAll(async done => {
            token = jwt.sign({
                user_id: "someid",
                username: "adminuser",
                email: "admin.example.com",
                role: "admin"
            }, process.env.APP_KEY)

            let course = new Course({
                name: "Course1",
                code: "CSE101",
                credit_hours: 3,
            });
            await course.save();
            course_id = course._id;
            done();
        });


        afterEach(async (done) => {
            await Course.deleteMany({});
            await User.deleteMany({});
            done();
        });

        it("should add the content of the course to the database", async () => {
            const content = [
                {
                    title: "week1",
                    type: "vid",
                    data: [
                        {
                            title: "lecture1",
                            url: "ommxadlfkjadf"
                        }
                    ]
                }
            ];
            let res = await request(server).post("/update-course")
                .set("token", token)
                .send({
                    code: "CSE101",
                    content: content
                })
                expect(res.status).toBe(200);
                expect(res.body.message).toBe("Course 'CSE101' was updated successfully")
                let course = await Course.findOne({ code: "CSE101" }).lean();
                expect(course.content).toStrictEqual(content);
        })
    });
});
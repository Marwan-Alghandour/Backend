const { Course } = require("../../src/resources/courses/course.model");
const { User } = require("../../src/resources/user/user.model");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();
var server;
var token;

describe("test user authentication", () => {

    // beforeAll(done => {
    //     mongoose.connection.open();
    //     done()
    // });

    afterAll(done => {
        // mongoose.connection.close()
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

        beforeEach(async (done) => {
            server = await require("../../app.js");
            done();
        });

        afterEach(async (done) => {
            await server.close();
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
    })
});
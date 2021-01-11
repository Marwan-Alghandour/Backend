const { User } = require("../../src/resources/user/user.model");
const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
var server;
var token;
require("dotenv").config();

describe("test user authentication", () => {

    beforeAll(async done => {
        server = await require("../../app.js");
        done();
    })

    afterAll(done => {
        server.close();
        done();
    });

    describe("/login", () => {
        beforeEach(async (done) => {
            const hash = await bcrypt.hash("mypassword", 10);
            const user = new User({ username: "username", password: hash, email: "user@example.com" });
            await user.save();
            done();
        });

        afterEach(async (done) => {
            await User.deleteMany({});
            done();
        });

        it("should return status code 200 with token in place", async (done) => {
            const res = await request(server)
                .post("/login")
                .send({ username: "username", password: "mypassword" });
            expect(res.status).toBe(200);

            const data = JSON.parse(res.text);
            expect(data.token).toBeTruthy();

            const payload = jwt.verify(data.token, process.env.APP_KEY);
            expect(payload.user_id).toBeTruthy()
            expect(payload.username).toBe("username");
            expect(payload.email).toBe("user@example.com");
            expect(payload.role).toBe("student");
            done();
        });

        it("should return status code 400 with Wrong username or password error", async (done) => {
            const res = await request(server)
                .post("/login")
                .send({ username: "not my username", password: "mypassword" });
            expect(res.status).toBe(400);
            expect(res.text).toBe("Wrong username or password");
            done();
        });

        it("should return status code 400 with Wrong username or password error", async (done) => {
            const res = await request(server)
                .post("/login")
                .send({ username: "username", password: "not my password" });
            expect(res.status).toBe(400);
            expect(res.text).toBe("Wrong username or password")
            done();
        });

        it("should return status code 400 with required data", async (done) => {
            var res = await request(server).post("/login").send({ password: "password" });
            expect(res.status).toBe(400);
            res = await request(server).post("/login").send({ username: "username" });
            expect(res.status).toBe(400);
            done();
        });
    });

    describe("/create-account", () => {
        beforeAll(async done => {
            const hash = await bcrypt.hash("adminadmin", 10);
            const user = new User({
                username: "adminadmin",
                password: hash,
                email: "admin@example.com",
                role: "admin"
            });
            await user.save();
            token = await user.generateAuthToken();
            done();
        });


        afterEach(async (done) => {
            await User.deleteMany({});
            done();
        });

        it("should create an account in the database with the given role and return 200 status", async (done) => {

            let res = await request(server).post("/create-account")
                .set("token", token)
                .send({
                    username: "username",
                    email: "email@exmaple.com",
                    role: "teacher",
                    password: "somepassword"
                });
            expect(res.body.message).toBe("user 'username' was created successfully");
            expect(res.status).toBe(200);
            done();
        });
    });
});

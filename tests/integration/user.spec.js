const { User } = require("../../src/resources/user/user.model");
const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
var server;
require("dotenv").config();

describe("test user authentication", () => {

    afterAll(done => {
        mongoose.connection.close()
        done();
    });
    describe("/login", () => {
        beforeEach(async () => {
            server = await require("../../app.js");
            const hash = await bcrypt.hash("mypassword", 10);
            const user = new User({ username: "username", password: hash, email: "user@example.com" });
            await user.save();
        });

        afterEach(async () => {
            server.close();
            await User.deleteMany({});
        });

        it("should return status code 200 with token in place", async () => {
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
        });

        it("should return status code 400 with Wrong username or password error", async () => {
            const res = await request(server)
                .post("/login")
                .send({ username: "not my username", password: "mypassword" });
            expect(res.status).toBe(400);
            expect(res.text).toBe("Wrong username or password")
        });

        it("should return status code 400 with Wrong username or password error", async () => {
            const res = await request(server)
                .post("/login")
                .send({ username: "username", password: "not my password" });
            expect(res.status).toBe(400);
            expect(res.text).toBe("Wrong username or password")
        });

        it("should return status code 400 with required data", async () => {
            var res = await request(server).post("/login").send({password: "password"});
            expect(res.status).toBe(400);
            res = await request(server).post("/login").send({username: "username"});
            expect(res.status).toBe(400);
        });
    });
});

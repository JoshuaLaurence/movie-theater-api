const request = require("supertest")
const seed = require("../db/seed");
const { User } = require("../models");
const app = require("../src/server")
const userRouter = require("../routes/user")

describe("Get all Users", () => {

    beforeAll( async () => {
        await User.sync({force: true})
        await User.build({ username: "username", password: "password"})
    })

    test("Responds with OK status", async () => {
        await request(app).get("/user/").expect(200);
    })
})

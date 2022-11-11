//Requiring express and creating a router
const express = require("express")
const userRouter = express.Router()

//Import User & Show model from database
const { Show, User } = require("../models")

const findUser = require("../middleware/user.middleware")
const {findShow} = require("../middleware/shows.middleware")

const {body, validationResult} = require("express-validator")

//Gets all the users within the database
//Tested Using Postman
userRouter.get("/",
    async (request, response) => {
        try {
            const allUsers = await User.findAll()
            if (allUsers.length === 0) {
                throw new Error("No users exists yet within the database")
            }
            response.status(200).send(allUsers)
        } catch (error) {
            response.status(204).send(error.message) //Sends error with a 204 (no content) status code
        }
    }
);

//Gets specific user when the router is passed a specific id
//Tested Using Postman
userRouter.get("/:userID",
    findUser,
    (request, response) => {
        response.status(200).send(request.body.specificUser)
    }
)

//Gets specific user's shows and returns a 404 if the user is yet to watch any shows
//Tested Using Postman
userRouter.get("/:userID/shows",
    findUser,
    async (request, response) => {
        try {
            const shows = await request.body.specificUser.getShows()
            if (shows.length === 0) { throw new Error("User hasn't watched any shows yet") } //If the user has no shows, throw and error with an appropriate message
            response.status(200).send(shows)
        } catch (error) {
            response.status(404).send(error.message) //Sends error with a 404 (not found) status code
        }
    }
);

//Retrieves specific show from users watched list, and if it isn't within the watched list, adds it
//Tested Using Postman
userRouter.put("/:userID/shows/:showID",
    findUser,
    findShow,
    async (request, response) => {
        const usersShows = await request.body.specificUser.getShows()
        if (usersShows.includes(request.body.specificShow)) {
            response.status(302).send("This show is already in this user's watched list")
        }
        await request.body.specificUser.addShow(request.body.specificShow)
        await request.body.specificShow.update({watched: true})
        response.status(200).send("This show is now in the user's watched list")
    }
)

//EXTENSION
//Creating a user
userRouter.post("/new",
    body("username").notEmpty(),
    body("password").notEmpty(),
    async (request, response) => {
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            return response.status(404).send(errors.array()[0].msg)
        }

        try {
            const newUser = await User.create(request.body)
            response.status(200).send(newUser)
        } catch (error) {
            response.status(500).send("Creation failed")
        }
    }
)


//Exporting userRouter
module.exports = userRouter;

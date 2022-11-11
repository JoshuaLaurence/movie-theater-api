//Requiring express and creating a router
const express = require("express")
const userRouter = express.Router()

//Import User & Show model from database
const { Show, User } = require("../models")

const findUser = require("../middleware/user.middleware")

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




//Exporting userRouter
module.exports = userRouter;

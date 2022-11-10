//Requiring express and creating a router
const express = require("express")
const userRouter = express.Router()

//Import User & Show model from database
const { Show, User } = require("../models")

//Gets all the users within the database
//Has been tested with postman - Postman Pat Approved
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
//Postman Pat Approved
userRouter.get("/:userID",
    async (request, response) => {
        try {
            const specificUser = await User.findOne({ where : { id: request.params.userID } })
            if (specificUser === null) {
                throw new Error("No user with that ID exists in the database")
            }
            response.status(200).send(specificUser)
        } catch (error) {
            response.status(404).send(error.message) //Sends error with a 404 (not found) status code
        }
    }
)

//Gets specific user's shows and returns a 404 if the user is yet to watch any shows
//Postman Pat Approved
userRouter.get("/:userID/shows",
    async (request, response) => {
        try {
            const specificUser = await User.findOne({ where : { id: request.params.userID } }, {include: Show})
            if (specificUser === null) {
                throw new Error("No user with that ID exists in the database")
            }
            const shows = await specificUser.getShows()
            if (shows.length === 0) { throw new Error("User hasn't watched any shows yet") } //If the user has no shows, throw and error with an appropriate message
            response.status(200).send(shows)
        } catch (error) {
            response.status(404).send(error.message) //Sends error with a 404 (not found) status code
        }
    }
);




//Exporting userRouter
module.exports = userRouter;

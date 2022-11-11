//Requiring express and creating a router
const express = require("express")
const showsRouter = express.Router()

//Import User & Show model from database
const {User, Show} = require("../models")

//Importing middleware
const {toTitleCase, findShow} = require("../middleware/shows.middleware")

//Gets all the shows within the database
//Tested Using Postman
showsRouter.get("/",
    async (request, response) => {
        try {
            const allShows = await Show.findAll()
            if (allShows.length === 0) {
                throw new Error("No shows exists yet within the database")
            }
            response.status(200).send(allShows)
        } catch (error) {
            response.status(204).send(error.message) //Sends error with a 204 (no content) status code
        }
    }
);

//Gets specific show when the router is passed a specific id
//Tested Using Postman
showsRouter.get("/:showID",
    findShow,
    (request, response) => {
        response.status(200).send(request.body.specificShow)
    }
)



//Gets all shows witin a specific genre
//Tested Using Postman
showsRouter.get("/genres/:genre",
    toTitleCase,
    async (request, response) => {
        try {
            const genredShows = await Show.findAll({ where : { genre: request.params.genre }})
            if (genredShows.length === 0) {
                throw new Error("There are no shows within this genre")
            }
            response.status(200).send(genredShows)
        } catch (error) {
            response.status(404).send(error.message) //Sends error with a 404 (not found) status code
        }
    }
);

//Update the status of a show from "cancelled" to "on-going" or visa versa
//Tested Using Postman
showsRouter.put("/:showID/updates",
    findShow,
    async (request, response) => {
        try {
            const oldStatus = request.body.specificShow.status;
            if (oldStatus === "cancelled") {
                await request.body.specificShow.update({status : "on-going"})
            } else { await request.body.specificShow.update({status : "cancelled"}) }
            console.log(request.body.specificShow.status)
            response.status(200).send(`Status of show ${request.body.specificShow.id} changed from ${oldStatus} to ${request.body.specificShow.status}`)
        } catch (error) {
            response.status(404).send(error.message) //Sends error with a 404 (not found) status code
        }
    }
)

//Update the rating of a specific show
//Yet to be tested
showsRouter.put("/:showID/watched/:rating",
    async (request, response) => {
        try {

        } catch (error) {

        }
    }
)


//Delete a specific show
//Tested Using Postman
showsRouter.delete("/delete/:showID",
    findShow,
    async (request, response) => {
        try {
            await Show.destroy({where: {id: request.params.showID}})
            response.status(200).send("Show Deleted")
        } catch (error) {
            response.status(500).send("Failed to delete show")
        }
    }
)

//EXTENSION
//Creating a show


//Exporting showsRouter
module.exports = showsRouter;

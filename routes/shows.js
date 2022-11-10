//Requiring express and creating a router
const express = require("express")
const showsRouter = express.Router()

//Import User & Show model from database
const {User, Show} = require("../models")

//Importing middleware
const toTitleCase = require("../middleware/shows.middleware")

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
    async (request, response) => {
        try {
            const specificShow = await Show.findOne({ where : { id: request.params.showID } })
            if (specificShow === null) {
                throw new Error("No show with that ID exists in the database")
            }
            response.status(200).send(specificShow)
        } catch (error) {
            response.status(404).send(error.message) //Sends error with a 404 (not found) status code
        }
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
    async (request, response) => {
        try {
            const specificShow = await Show.findOne({ where : { id: request.params.showID } })
            console.log(specificShow.status)
            if (specificShow !== null) {
                const oldStatus = specificShow.status;
                if (oldStatus === "cancelled") {
                    await specificShow.update({status : "on-going"})
                } else { await specificShow.update({status : "cancelled"}) }
                console.log(specificShow.status)
                response.status(200).send(`Status of show ${specificShow.id} changed from ${oldStatus} to ${specificShow.status}`)
            } else { throw new Error("No show with that ID exists in the database") }
        } catch (error) {
            response.status(404).send(error.message) //Sends error with a 404 (not found) status code
        }
    }
)


//Delete a specific show
showsRouter.delete("/:showID", async (request, response) => {
    try {
        const specificShow = await Show.destroy({ where : { id: request.params.showID }})
        if (specificShow === null) {
            throw new Error("No show with that ID exists in the database")
        }
        response.status(200).send("Show deleted")
    } catch (error) {
        response.status(404).send(error.message) //Sends error with a 404 (not found) status code
    }
})


//Exporting showsRouter
module.exports = showsRouter;

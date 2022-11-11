//Requiring express and creating a router
const express = require("express")
const showsRouter = express.Router()

//Import User & Show model from database
const {User, Show} = require("../models")

//Importing middleware
const {toTitleCase, findShow } = require("../middleware/shows.middleware")

//Import express-validator
const { body, param, validationResult } = require("express-validator")

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
showsRouter.put("/:showID/updates/:status",
    findShow,
    param("status")
        .isLength({min: 5, max: 25})
        .custom((value) => {
            if (/\s/.test(value)) {
                return false
            }
            return true
        })
        .notEmpty(),
    async (request, response) => {

        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            return response.status(404).send({errors: errors.array()})
        }

        try {
            const oldStatus = request.body.specificShow.status;
            await request.body.specificShow.update({status : request.params.status})
            response.status(200).send(`Status of show ${request.body.specificShow.id}
                has been updated from ${oldStatus}
                to ${request.body.specificShow.status}`)
        } catch (error) {
            response.status(500).send(error.message) //Sends error with a 404 (not found) status code
        }
    }
)

//Update the rating of a specific show
//Tested Using Postman
showsRouter.put("/:showID/watched/:rating",
    findShow,
    param("rating").isInt({min: 0, max:5}),
    async (request, response) => {

        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            return response.status(404).send(errors.array()[0].msg)
        }

        try {
            if (!request.body.specificShow.watched) {
                throw new Error("This show has yet to be watched. You can only set ratings for watched shows")
            }
            const oldRating = request.body.specificShow.rating;
            await request.body.specificShow.update({rating: request.params.rating});
            response.status(200).send(`Rating updated from ${oldRating} to ${request.body.specificShow.rating}`)
        } catch (error) {
            response.status(400).send(error.message)
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

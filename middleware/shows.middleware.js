const { Show } = require("../models");

//Middleware function to create change a word to Title Case
function toTitleCase(request, response, next) {
    const allLowerCase = request.params.genre.toLowerCase()
    request.params.genre = allLowerCase
        .split()
        .map(
            function (string) {
                return (string.charAt(0).toUpperCase() + string.slice(1));
            }
        )
        .join("")
    next()
}

async function findShow(request, response, next) {
    try {
        const specificShow = await Show.findOne({where: {id: request.params.showID}})
        if (specificShow === null) {
            throw new Error("No show with that ID exists within the database")
        }
        console.log(specificShow.title)
        request.body = {...request.body, ...{"specificShow": specificShow}}
        console.log(request.body)
        next()
    } catch (error) {
        response.status(404).send(error.message)
    }
}

module.exports = {toTitleCase, findShow}

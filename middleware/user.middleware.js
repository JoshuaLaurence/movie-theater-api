const {User} = require("../models")

async function findUser(request, response, next) {
    try {
        const specificUser = await User.findOne({ where : { id: request.params.userID } })
        if (specificUser === null) {
            throw new Error("No user with that ID exists in the database")
        }
        request.body = {...request.body, ...{"specificUser": specificUser}}
        next()
    } catch (error) {
        response.status(404).send(error.message) //Sends error with a 404 (not found) status code
    }
}

module.exports = findUser;

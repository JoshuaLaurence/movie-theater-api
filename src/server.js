//Requiring Express and creating an instance
const express = require("express")
const app = express()

//Importing the seed function
const seed = require("../db/seed")

//Calling the routers
const userRouter = require("../routes/user")
const showsRouter = require("../routes/shows")

seed();

app.use("/users", userRouter)
app.use("/shows", showsRouter)
app.use(express.json())

const port = 5001
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

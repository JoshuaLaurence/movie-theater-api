//Requiring Express and creating an instance
const express = require("express")
const app = express()

//Calling the routers
const userRouter = require("./routes/user")
const showsRouter = require("./routes/shows")

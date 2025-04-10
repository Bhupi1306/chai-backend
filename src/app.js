import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"  // To perform CRUD operation on cookies

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "20kb"})) // To allow express to accept json files
app.use(express.urlencoded({extended: true, limit: "20kb"})) // To accept data from url with spaces and special char resolved
app.use(express.static("public")) // To make a folder public
app.use(cookieParser())

// Routes import
import userRouter from "./routes/user.routes.js"

// Router Declaration
//app.get() We cannot use this because now router and controllers are in different places We need to use middleware instead.

// This gives controll to userRouter where further methods are defined. It makes code less clumsy
// http://localhost:8000/api/users/register
app.use("/api/v1/users", userRouter) 


export {app}
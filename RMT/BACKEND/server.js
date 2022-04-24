const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const dotenv = require("dotenv")
const app = express()
require("dotenv").config()

const PORT = process.env.PORT || 8070

app.use(cors())
app.use(express.json())

const URL = process.env.MONGODB_URL

mongoose.connect(URL, {

  useNewUrlParser: true,
  useUnifiedTopology: true,
 
})

const connection = mongoose.connection

connection.once("open", () => {
  console.log("Mongodb connection success!")
})


// Admin routes
const admintRouter = require("./routes/admin.js")
app.use("/admin", admintRouter)


// Student routes
const studentRouter = require("./routes/student.js")
app.use("/student", studentRouter)


// Panel routes
const panelRouter = require("./routes/panel.js")
app.use("/panel", panelRouter)


//Supervisor routes 


app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`)
})

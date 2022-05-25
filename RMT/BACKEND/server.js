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
app.use("/admins", admintRouter)


// Student routes
const studentRouter = require("./routes/student.js")
app.use("/student", studentRouter)


// Panel routes
const panelRouter = require("./routes/panel.js")
app.use("/panels", panelRouter)


//Staff routes
const staffRouter = require("./routes/staff.js")
app.use("/staff",staffRouter)


// Marking routes
const markingSchemRouter = require("./routes/markingScheme.js")
app.use("/marking-schemes", markingSchemRouter)


app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`)
})

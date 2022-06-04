const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const verifyJWT = require('./middleware/verifyJWT');
require("dotenv").config();


const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(express.json({limit: "30mb",extended:true}));

// parse application/x-www-form-urlencoded

// app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
// app.use(bodyParser.json())



const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Mongodb connection success!");
});

//Login routes
const loginRouter=require("./routes/login");
// const verifyJWT = require("./middleware/verifyJWT.js");
app.use("/main",loginRouter);

// Student routes
const studentRouter = require("./routes/student.js");
app.use("/student", studentRouter);

app.use(verifyJWT);

// Admin routes
const admintRouter = require("./routes/admin.js");
app.use("/admins", admintRouter);



// Student group route
const groupRouter = require("./routes/studentGroup.js")
app.use("/studentGroups", groupRouter)

// Panel routes
const panelRouter = require("./routes/panel.js")
app.use("/panels", panelRouter)

//Staff routes
const staffRouter = require("./routes/staff.js");
app.use("/staff", staffRouter);

// Marking routes
const markingSchemRouter = require("./routes/markingScheme.js");
app.use("/marking-schemes", markingSchemRouter);

// Submissions routes
const submissionRouter = require("./routes/submission")
app.use("/submissions", submissionRouter);

//file upload routes
const fileuploadRouter = require("./routes/fileupload")
app.use("/fileupload",fileuploadRouter)





app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});

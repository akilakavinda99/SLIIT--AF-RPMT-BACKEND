const router = require("express").Router()
let Student = require("../models/student")
let requestSupervisor = require("../models/requestSupervisor.js")
let requestCoSupervisor = require("../models/requestCoSupervisor.js")
let registerResearch = require("../models/registerResearchTopic.js")

const {protect}=require('../middleware/authMiddleware')
const {protect_student}=require('../middleware/authMiddleware_student')

// Add new Student to the system
router.route("/add").post((req, res) => {

    const name = req.body.name
    const itNumber = req.body.itNumber
    const email = req.body.email
    const password = req.body.password

    const newStudent = new Student({
        name,
        itNumber,
        email,
        password
    })

    newStudent.save().then(() => {
        res.json("New Student added to the system.")
    }).catch((error) => {
         res.json(error)
        console.log(error)
    })

})

// Supervisor Request
router.route("/requestSupervisor").post((protect_student),(req, res) => {

    const name = req.body.name
    const requestedDate = req.body.requestedDate
   

    const newRequest = new requestSupervisor({
        name,
       requestedDate
    })

    newRequest.save().then(() => {
        res.json("Supervisor request added to the system.")
    }).catch((error) => {
        console.log(error)
    })

})

// CoSupervisor Request
router.route("/requestCoSupervisor").post((protect_student),(req, res) => {

    const name = req.body.name
    const requestedDate = req.body.requestedDate
   

    const newRequest = new requestCoSupervisor({
        name,
       requestedDate
    })

    newRequest.save().then(() => {
        res.json("Supervisor request added to the system.")
    }).catch((error) => {
        console.log(error)
    })

})

//get one students details
router.route("/get/:id").get(async(req,res)=>{
    const id = req.params.id;

   await Student.findById(id).then((student)=>{
        res.status(200).send({status:"student fetched", student});
    
    }).catch((e)=>{
        res.status(500).send({status:"Error"});
    })

})

//update student details
router.route("/update/:id").put(async (req,res)=>{
    const id = req.params.id;
    const  {name,
        itNumber,
        email,
        password} =req.body;

    const updateStudent ={
        name,
        itNumber,
        email,
        password
    }

     await Student.findByIdAndUpdate(id,updateStudent).then(()=>{
        res.status(200).send({status:"student updated"});
    }).catch((e)=>{
        res.status(500).send({status:"Error"});
    })

})

// Register Research Topic
router.route("/registerResearch").post((protect_student),(req, res) => {

    const name = req.body.name
    const topic = req.body.requestedDate
   

    const newRequest = new registerResearch({
        name,
       topic
    })

    registerResearch.save().then(() => {
        res.json("Research topic added to the system.")
    }).catch((error) => {
        console.log(error)
    })

})



module.exports = router
const router = require("express").Router()
const bcrypt = require("bcrypt")
let Staff = require("../models/staff.js")
let ResearchTopic = require("../models/acceptTopics")

const { protect } = require('../middleware/authMiddleware')
const { protect_staff } = require('../middleware/authMiddleware_staff')

//Add new staff member to the system
router.route("/add").post(async (req, res) => {

    const saltPassword = await bcrypt.genSalt(10)
    const securePassword = await bcrypt.hash(req.body.password, saltPassword)
    const name = req.body.name
    const username = req.body.username
    const email = req.body.email
    const password = securePassword

    const newStaff = new Staff({
        name,
        username,
        email,
        password
    })

    newStaff.save().then(() => {
        res.json("New Staff member added to the system.")
    }).catch((error) => {
        res.json(error)
        console.log(error)
    })

})

// Get staff member details
router.route("/get/:id").get((protect_staff),async(req, res)=> {
    const staffId = req.params.id;

    await Staff.findById(staffId).then((staff) => {
        res.status(200).send({status : "Staff member data fetched.", staff});

    }).catch((err) => {
        console.log(err.message)
        res.status(500).send({status: "Error with fetching data"});
    })
})

//Update staff member details
router.route("/update/:id").put((protect_staff), async (req, res) => {
    let staffId = req.params.id;

    const updateStaff = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password

    }

    await Staff.findByIdAndUpdate(staffId, updateStaff).then(() => {
        res.status(200).send({
            status: "Staff member updated."
        })
    }).catch((err) => {
        console.log(err.message)
        res.status(500).send({
            stauts: "Error with updating data."
        })
    })
})

// Get all staff
router.route('/').get((req, res) => {
    Staff.find({}, {password:0})
        .then(staff => {
            res.json(staff)
        })
        .catch(err => {
            console.log(err.message)
            res.status(500).send({
                error: "Error with listing all staff"
            })
        })
})


//Accept reserch topic
router.route("/acceptTopics").post((req, res) => {

    const studentId = req.body.studentId
    const researchTopic = req.body.researchTopic
    const status = req.body.status
    const approvedDate = req.body.approvedDate

    const newTopic = new ResearchTopic({
        studentId,
        researchTopic,
        status,
        approvedDate
    })

    newTopic.save().then(() =>{
        res.json("Reasearch topic status update succesfully.")
    }).catch((err) =>{
        console.log(err.message)
    })
    
})

module.exports = router
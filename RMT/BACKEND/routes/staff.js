const router = require("express").Router()
let Staff = require("../models/staff.js")

const {protect}=require('../middleware/authMiddleware')
const {protect_staff}=require('../middleware/authMiddleware_staff')

//Add new staff member to the system
router.route("/add").post((req, res) => {

    const name = req.body.name
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

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
    let staffId = req.params.id;
    const staff = await Staff.findById(staffId, staff).then(() => {
        req.status(200).send({
            status : "Staff member data fetched."
        })
    }).catch((err) => {
        console.log(err.message)
        res.status(500).send({
            status: "Error with fetching data"
        })
    })
})

//Update staff member details
router.route("/update/:id").put((protect_staff),async(req, res) => {
    let staffId = req.params.id;
    const updateStaff = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password

    }

    await Staff.findByIdAndUpdate(staffId, updateStaff).then(() =>{
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


module.exports = router
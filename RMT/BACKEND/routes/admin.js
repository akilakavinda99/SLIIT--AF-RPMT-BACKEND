const router = require("express").Router()
let Admin = require("../models/admin.js")

const {protect}=require('../middleware/authMiddleware')

// Add new Admin to the system
router.route("/add").post((protect),(req, res) => {

    const newData = {
        name: req.body.name,
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    }

    Admin.findOne({
        email: newData.email
    })
        .then((admin) => {
            if (!admin) {

                const newAdmin = new Admin(newData)

                newAdmin.save().then(() => {
                    res.status(200).send({
                        status: "New admin added to the system."
                    })
                }).catch((err) => {
                    console.log(err.message)
                    res.status(500).send({
                        status: "Error with adding new admin."
                    })
                })

            } else {
                res.status(409).send({
                    status: "User already exists."
                })
            }
        })
        .catch((err) => {
            res.send("Error: " + err.message);
        })

})


// Get all admin details
router.route("/").get((protect),(req, res) => {

    Admin.find().then((admin) => {
        res.json(admin)
    }).catch((err) => {
        console.log(err.message)
        res.status(500).send({
            status: "Error with listing all admins."
        })
    })

})


// Update admin details
router.route("/update/:id").put((protect),async  (req, res) => {

    let adminID = req.params.id

    const updateAdmin = {
        name: req.body.name,
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    }

    await Admin.findByIdAndUpdate(adminID, updateAdmin)
        .then(() => {
            res.status(200).send({
                status: "User updated."
            })
        }).catch((err) => {
            console.log(err.message)
            res.status(500).send({
                status: "Error with updating data."
            })
        })

})


// Delete admin
router.route("/delete/:id").delete((protect),async (req, res) => {

    let adminID = req.params.id

    await Admin.findByIdAndDelete(adminID)
        .then(() => {
            res.status(200).send({
                status: "User accoutn deleted."
            })
        })
        .catch((err) => {
            console.log(err.message)
            res.status(500).send({
                status: "Error with deleting admin."
            })
        })

})


module.exports = router

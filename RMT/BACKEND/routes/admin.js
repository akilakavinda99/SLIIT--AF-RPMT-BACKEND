const router = require("express").Router()
let Admin = require("../models/admin.js")


// Add new Admin to the system
router.route("/add").post((req, res) => {

    const name = req.body.name
    const userName = req.body.userName
    const email = req.body.email
    const password = req.body.password

    const newAdmin = new Admin({
        name,
        userName,
        email,
        password
    })

    newAdmin.save().then(() => {
        res.json("New admin added to the system.")
    }).catch((error) => {
        console.log(error)
    })

})



module.exports = router

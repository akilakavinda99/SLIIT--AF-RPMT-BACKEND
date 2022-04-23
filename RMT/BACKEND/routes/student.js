const router = require("express").Router()
let Student = require("../models/student")


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



module.exports = router
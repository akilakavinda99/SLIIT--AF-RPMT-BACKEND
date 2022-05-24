const router = require("express").Router()
let Admin = require("../models/admin.js")

const { protect } = require('../middleware/authMiddleware')

const generatePass = (length) => {
    const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += randomChars.charAt(
            Math.floor(Math.random() * randomChars.length)
        );
    }
    return result;
}

// Add new Admin to the system
// router.route("/add").post((protect), (req, res) => {
router.route("/add").post((req, res) => {

    const password = generatePass(10)

    const newData = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        nameWithInitials: req.body.nameWithInitials,
        address: req.body.address,
        nic: req.body.nic,
        email: req.body.email,
        mobile: req.body.mobile,
        landline: req.body.landline,
        password: password
    }

    Admin.findOne({
        "admin": {
            email: newData.email,
            nic: newData.nic
        }
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
                        error: "Error with adding new admin."
                    })
                })

            } else {
                res.status(409).send({
                    error: "User already exists."
                })
            }
        })
        .catch((err) => {
            res.send("Error: " + err.message);
        })

})


// Get all admin details
// router.route("/").get((protect), (req, res) => {
router.route("/").get((req, res) => {

    Admin.find()
        .then((admin) => {
            res.json(admin)
        })
        .catch((err) => {
            console.log(err.message)
            res.status(500).send({
                error: "Error with listing all admins."
            })
        })

})


// Update admin details
router.route("/update/:id").put((protect), async (req, res) => {

    let adminID = req.params.id

    const updateAdmin = {
        firstname: req.body.name,
        lastname: req.body.lastname,
        nameWithInitials: req.body.nameWithInitials,
        address: req.body.address,
        nic: req.body.nic,
        email: req.body.email,
        mobile: req.body.mobile,
        landline: req.body.landline,
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
router.route("/delete/:id").delete((protect), async (req, res) => {

    let adminID = req.params.id

    await Admin.findByIdAndDelete(adminID)
        .then(() => {
            res.status(200).send({
                status: "User account deleted."
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

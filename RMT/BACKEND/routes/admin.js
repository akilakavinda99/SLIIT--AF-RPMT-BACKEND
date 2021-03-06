const router = require("express").Router()
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

let Admin = require("../models/admin.js")
let Staff = require("../models/staff")
let Student = require("../models/student")
let StudentGroup = require("../models/studentGroup")
let Panel = require("../models/panel")

const { protect } = require('../middleware/authMiddleware')
const verifyJWT = require("../middleware/verifyJWT.js")
const verifyRoles = require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/roles_list.js")

// Generate a random password
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
router.route("/add").post([(verifyJWT), (verifyRoles(ROLES_LIST.admin))], (req, res) => {

    const password = generatePass(10)
    const saltRounds = 10
    const hashedPassword = bcrypt.hashSync(password, saltRounds)

    const newData = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        nameWithInitials: req.body.nameWithInitials,
        address: req.body.address,
        nic: req.body.nic,
        email: req.body.email,
        mobile: req.body.mobile,
        landline: req.body.landline,
        password: hashedPassword
    }

    Admin.findOne({ email: newData.email })
        .then((admin) => {
            if (!admin) {

                const newAdmin = new Admin(newData)

                newAdmin.save()
                    .then(() => {

                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'resortsooriya@gmail.com',
                                pass: 'jeyqmnctscnjdcbe'
                            }
                        });

                        var mailOptions = {
                            from: 'resortsooriya@gmail.com',
                            to: newData.email,
                            subject: 'SLIIT Research Project Management System',
                            text: `You have been successfully registered to SLIIT Research Project Management System. 
                            Login credentials: (Username: ${newData.email}, Password: ${password})`
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });

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
                console.log(admin);
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
router.route("/").get([(verifyJWT), (verifyRoles(ROLES_LIST.admin))], (req, res) => {
    // router.route("/").get((req, res) => {

    Admin.find({}, { password: 0 })
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
// router.route("/update").put((protect), async (req, res) => {
router.route("/update").put([(verifyJWT), (verifyRoles(ROLES_LIST.admin))], async (req, res) => {

    let admin = req.body

    // const updateAdmin = {
    //     firstname: req.body.name,
    //     lastname: req.body.lastname,
    //     nameWithInitials: req.body.nameWithInitials,
    //     address: req.body.address,
    //     nic: req.body.nic,
    //     email: req.body.email,
    //     mobile: req.body.mobile,
    //     landline: req.body.landline,
    // }

    await Admin.findByIdAndUpdate(admin._id, admin)
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
router.route("/delete/:id").delete([(verifyJWT), (verifyRoles(ROLES_LIST.admin))], async (req, res) => {

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
                error: "Error with deleting admin."
            })
        })

})


// Get dashboard summary
router.route('/summary').get([(verifyJWT), (verifyRoles(ROLES_LIST.admin))], async (req, res) => {
    try {
        const staffCount = await Staff.estimatedDocumentCount({ isAccepted: true })
        const studentCount = await Student.estimatedDocumentCount()
        const stdGrpCount = await StudentGroup.estimatedDocumentCount()
        const panelCount = await Panel.estimatedDocumentCount()

        res.status(200).send({
            status: "Successfully counted.",
            staffCount,
            studentCount,
            stdGrpCount,
            panelCount
        })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})


// Get admin details
router.route('/profile').post([(verifyJWT), (verifyRoles(ROLES_LIST.admin))], async (req, res) => {

    const { adminId } = req.body
    // console.log(adminId);

    Admin.findById(adminId)
        .then(admin => {
            res.status(200).send(admin)
        })
        .catch(err => {
            console.log(err.message)
            res.status(500).send({ error: "Error with fetching data." })
        })
})


// Change password
router.route('/changePass').put([(verifyJWT), (verifyRoles(ROLES_LIST.admin))], async (req, res) => {

    const { adminId, currentPass, newPass, confirmPass } = req.body

    Admin.findById(adminId)
        .then(admin => {
            if (bcrypt.compareSync(currentPass, admin.password)) {
                if (newPass === confirmPass) {
                    const hashedPass = bcrypt.hashSync(newPass, 10)
                    Admin.findByIdAndUpdate(adminId, { password: hashedPass })
                        .then(() => {
                            res.send({ status: "Password successfully changed." })
                        })
                        .catch(err => {
                            console.log(err.message);
                            res.send({ error: "Internal server error!" })
                        })
                } else {
                    res.send({ error: "New password and confirm password doesn't match!" })
                }
            } else {
                res.send({ error: "Invalid current password!" })
            }
        })
        .catch(err => {
            console.log(err.message);
            res.send({ error: "Error with user action!" })
        })
})


module.exports = router

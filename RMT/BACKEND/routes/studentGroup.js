const router = require('express').Router()
let StudentGroup = require('../models/studentGroup')
let Panel = require('../models/panel')

const verifyJWT = require("../middleware/verifyJWT.js")
const verifyRoles = require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/roles_list.js")

// Get all student groups
router.route('/').get([(verifyJWT), (verifyRoles(ROLES_LIST.admin, ROLES_LIST.Staff))], (req, res) => {
    StudentGroup.find()
        .then(groups => {
            res.status(200).send({
                status: "Successfully fetched.",
                groups: groups
            })
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send({ error: "Error with fetching data." })
        })
})


// Get no panel groups
router.route('/nopanel').get([(verifyJWT), (verifyRoles(ROLES_LIST.admin, ROLES_LIST.Staff))], (req, res) => {
    StudentGroup.find({ allocatedPanel: { $exists: false } })
        .then(groups => {
            res.status(200).send({
                status: "Successfully fetched.",
                groups: groups
            })
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send({ error: "Error with fetching data." })
        })
})


// Get groups that have panels
router.route('/havepanel').get([(verifyJWT), (verifyRoles(ROLES_LIST.admin, ROLES_LIST.Staff))], (req, res) => {
    StudentGroup.find({ allocatedPanel: { $exists: true } })
        .then(groups => {
            res.status(200).send({
                status: "Successfully fetched.",
                groups: groups
            })
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send({ error: "Error with fetching data." })
        })
})


// Get selected group details
router.route('/:id').get((verifyJWT), (req, res) => {
    StudentGroup.findById(req.params.id)
        .then(group => {
            // console.log(group);
            res.json({ group: group })
        })
        .catch(err => {
            console.log(err.message);
            res.json({ error: "Error with fetching data" })
        })
})


// Allocate panels randomly
router.route('/rondomAllocatePanel').put([(verifyJWT), (verifyRoles(ROLES_LIST.admin))], (req, res) => {
    Panel.find()
        .then(panels => {
            // console.log(panels);
            if (panels.length > 0) {
                StudentGroup.find({ allocatedPanel: { $exists: false } })
                    .then(studentGroups => {
                        // console.log(studentGroups);
                        // res.json(studentGroups)
                        if (studentGroups.length > 0) {
                            studentGroups.forEach(async studentGroup => {
                                var selectedPanel = panels[Math.floor(Math.random() * panels.length)]
                                studentGroup.allocatedPanel = selectedPanel

                                await StudentGroup.findByIdAndUpdate(studentGroup._id, studentGroup)
                            })
                            res.json({ status: "Panels successfully allocated." })
                        } else {
                            // res.status(500).send({ error: "Every group has a panel." })
                            res.json({ error: "Every group has a panel." })
                        }
                    })
                    .catch(err => {
                        console.log(err.message);
                        res.json({ error: "Error occured while assigning panels!" })
                    })
            } else {
                res.json({ error: "No panel to assign." })
                console.log("No panel for assign!");
            }

        })
        .catch(err => {
            console.log(err.message);
            res.json(err.message)
        })
})


module.exports = router

const router = require("express").Router()
const ROLES_LIST = require("../config/roles_list.js")
const verifyJWT = require("../middleware/verifyJWT.js")
const verifyRoles = require("../middleware/verifyRoles.js")
const MarkingScheme = require("../models/markingScheme.js")
// const { route } = require("./admin.js")


// Create new marking scheme
router.route("/create").post([(verifyJWT), (verifyRoles(ROLES_LIST.admin))], (req, res) => {

    const newData = {
        name: req.body.name,
        marking: req.body.marking,
        available: req.body.available
    }

    // console.log(newData);
    const newMarking = new MarkingScheme(newData)

    newMarking.save()
        .then(() => {
            res.status(200).send({
                status: "Marking scheme successfully created."
            })
        })
        .catch((err) => {
            console.log(err.message)
            res.status(500).send({
                error: "Error with creating the marking scheme."
            })
        })

})


// Get all marking schemes
router.route("/").get((verifyJWT), (req, res) => {

    MarkingScheme.find()
        .then((marking) => {
            res.status(200).send({
                status: "Data successfully fetched.",
                markings: marking
            })
            console.log(marking);
        })
        .catch((err) => {
            console.log(err.message)
            res.status(500).send({
                error: "Error with fetching data."
            })
        })

})


// Get a selected marking scheme
router.route("/:id").get((verifyJWT), (req, res) => {

    let markingID = req.params.id

    MarkingScheme.findById(markingID)
        .then((marking) => {
            res.status(200).send({
                status: "Data successfully fetched",
                marking: marking
            })
        })
        .catch((err) => {
            console.log(err.message)
            res.status(500).send({
                error: "Error with fetching data."
            })
        })
})


// Delete a marking scheme
router.route("/delete/:id").delete([(verifyJWT), (verifyRoles(ROLES_LIST.admin))], async (req, res) => {

    let markingID = req.params.id

    await MarkingScheme.findByIdAndDelete(markingID)
        .then(() => {
            res.status(200).send({
                status: "Marking scheme successfully deleted."
            })
        })
        .catch((err) => {
            console.log(err.message)
            res.status(500).send({
                error: "Error with deleting marking scheme."
            })
        })
})


// Update marking scheme
router.route("/update/:id").put([(verifyJWT), (verifyRoles(ROLES_LIST.admin))], async (req, res) => {
    const markingId = req.params.id
    const markingData = req.body
    markingData.lastModified = new Date()
    // console.log(markingId);
    // console.log(markingData);

    await MarkingScheme.findByIdAndUpdate(markingId, markingData)
        .then(() => {
            res.status(200).send({ status: "Marking scheme successfully updated!" })
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ error: "Error with updating data!" })
        })
})


module.exports = router

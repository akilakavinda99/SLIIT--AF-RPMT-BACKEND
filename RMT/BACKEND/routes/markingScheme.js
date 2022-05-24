const router = require("express").Router()
const MarkingScheme = require("../models/markingScheme.js")
// const { route } = require("./admin.js")


// Create new marking scheme
router.route("/create").post((req, res) => {

    const newData = {
        name: req.body.name,
        marking: req.body.marking
    }

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
router.route("/").get((req, res) => {

    MarkingScheme.find()
        .then((marking) => {
            res.status(200).send({
                status: "Data successfully fetched.",
                markings: marking
            })
        })
        .catch((err) => {
            console.log(err.message)
            res.status(500).send({
                error: "Error with fetching data."
            })
        })

})


// Get a selected marking scheme
router.route("/:id").get((req, res) => {

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
router.route("/delete/:id").delete(async (req, res) => {

    let markingID = req.params.id

    await MarkingScheme.findByIdAndDelete(markingID)
        .then(() => {
            res.status(200).send({
                status: "User account successfully deleted."
            })
        })
        .catch((err) => {
            console.log(err.message)
            res.status(500).send({
                error: "Error with deleting marking scheme."
            })
        })
})


module.exports = router

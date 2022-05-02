const router = require("express").Router();
let Panel = require("../models/panel.js");

const {protect_panel}=require('../middleware/authMiddleware_panel')
const {protect}=require('../middleware/authMiddleware')

// Create new panel
router.route("/new").post((protect),(req, res) => {

    const newData = req.body

    Panel.findOne({
        panelName: newData.panelName
    })
        .then((panel) => {
            if (!panel) {

                const newPanel = new Panel(newData)

                console.log(newPanel)

                newPanel.save()
                    .then(() => {
                        res.status(200).send({
                            status: "New pannel created."
                        })
                    })
                    .catch((err) => {
                        console.log(err.message)
                        res.status(500).send({
                            status: "Error with creating panel."
                        })
                    })

            } else {
                res.status(409).send({
                    status: "Panel name alreadey taken."
                })
            }
        })
        .catch((err) => {
            res.send("Error: " + err.message)
        })
})


// Get all panel details
router.route("/").get((protect),(req, res) => {

    Panel.find().then((panel) => {
        res.json(panel)
    }).catch((err) => {
        console.log(err.message)
        res.status(500).send({
            status: "Error with listing panels"
        })
    })
})


// Update panel details
router.route("/update/:id").put((protect),async (req, res) => {

    let panelID = req.params.id
    const newData = req.body

    await Panel.findByIdAndUpdate(panelID, newData)
        .then(() => {
            res.status(200).send({
                status: "Panel updated."
            })
        })
        .catch((err) => {
            console.log(err.message)
            res.status(500).send({
                status: "Error with updating data."
            })
        })
})


// Remove panel
router.route("/delete/:id").delete((protect),async (req, res) => {

    let panelID = req.params.id

    await Panel.findByIdAndDelete(panelID)
        .then(() => {
            res.status(200).send({
                status: "Panel removed from the system."
            })
        })
        .catch((err) => {
            console.log(err.message)
            res.status(500).send({
                status: "Error with removing panel."
            })
        })
})


module.exports = router;

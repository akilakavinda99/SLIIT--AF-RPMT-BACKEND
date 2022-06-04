const router = require("express").Router();
let Panel = require("../models/panel.js");
let Staff = require("../models/staff")

const { protect_panel } = require('../middleware/authMiddleware_panel')
const { protect } = require('../middleware/authMiddleware');
const verifyJWT = require("../middleware/verifyJWT.js");
const verifyRoles = require("../middleware/verifyRoles.js");
const ROLES_LIST = require("../config/roles_list.js");

// Create new panel
// router.route("/new").post((protect),(req, res) => {
router.route("/new").post([(verifyJWT), (verifyRoles(ROLES_LIST.admin))], (req, res) => {

    const newData = req.body

    Panel.findOne({
        panelName: newData.panelName
    })
        .then((panel) => {
            if (!panel) {

                const newPanel = new Panel(newData)

                newPanel.save()
                    .then(() => {
                        newData.panelMembers.forEach(member => {

                            // Push new panel id to panel array in staff
                            Staff.findByIdAndUpdate(member,
                                { $push: { panel: newPanel._id } },
                                { safe: true, upsert: true },
                                function (err, doc) {
                                    if (err) {
                                        console.log(err);
                                    }
                                }
                            )
                        })
                        res.status(200).send({
                            status: "New pannel created."
                        })
                    })
                    .catch((err) => {
                        console.log(err.message)
                        res.status(500).send({
                            error: "Error with creating panel."
                        })
                    })

            } else {
                res.status(409).send({
                    error: "Panel name alreadey taken."
                })
            }
        })
        .catch((err) => {
            res.send("Error: " + err.message)
        })
})


// Get all panel details
// router.route("/").get((protect), (req, res) => {
router.route("/").get((verifyJWT), (req, res) => {

    Panel.find().then((panel) => {
        res.json(panel)
    }).catch((err) => {
        console.log(err.message)
        res.status(500).send({
            error: "Error with listing panels"
        })
    })
})


// Get selected panel details
router.route("/:id").get((verifyJWT), (req, res) => {
    const panelId = req.params.id;
    // console.log(panelId);

    Panel.findById(panelId)
        .then(panel => {
            res.status(200)
                .send({
                    status: "Panel data fetched.", panel
                })
        })
        .catch(err => {
            console.log(err.message);
            res.status(500)
                .send({
                    error: "Error with fetching data."
                })
        })
})


// Update panel details
// router.route("/update/:id").put((protect), async (req, res) => {
router.route("/update/:id").put([(verifyJWT), (verifyRoles(ROLES_LIST.admin))], async (req, res) => {

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
                error: "Error with updating data."
            })
        })
})


// Remove panel
// router.route("/delete/:id").delete((protect), async (req, res) => {
router.route("/delete/:id").delete([(verifyJWT), (verifyRoles(ROLES_LIST.admin))], async (req, res) => {

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
                error: "Error with removing panel."
            })
        })
})


module.exports = router;

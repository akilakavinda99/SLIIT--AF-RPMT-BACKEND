const router = require('express').Router()
let StudentGroup = require('../models/studentGroup')
let Panel = require('../models/panel')

// Get all student groups
router.route('/').get((req, res) => {
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


// Allocate panels randomly
router.route('/rondomAllocatePanel').put((req, res) => {
    Panel.find()
        .then(panels => {
            // console.log(panels);
            if (panels.length > 0) {
                StudentGroup.find({ $or: [{ presentationPanel: { $exists: false } }, { topicEvaluationPanel: { $exists: false } }] })
                    .then(studentGroups => {
                        console.log(studentGroups);
                        // res.json(studentGroups)
                        const updateComplete = studentGroups.forEach(async studentGroup => {
                            if (!studentGroup.presentationPanel) {
                                var presentationP = panels[Math.floor(Math.random() * panels.length)]
                                studentGroup.presentationPanel = presentationP
                            }
                            if (!studentGroup.topicEvaluationPanel) {
                                var topicP = panels[Math.floor(Math.random() * panels.length)]
                                if (panels.length != 1)
                                    while (topicP == presentationP) {
                                        topicP = panels[Math.floor(Math.random() * panels.length)]
                                    }
                                studentGroup.topicEvaluationPanel = topicP
                            }
                            await StudentGroup.findByIdAndUpdate(studentGroup._id, studentGroup)
                        })

                        Promise.all(updateComplete)
                            .then(() => {
                                res.status(200).send({ status: "Panels successfully assigned." })
                            })
                    })
                    .catch(err => {
                        console.log(err.message);
                        res.status(500).send({ error: "Error occured while assigning panels!" })
                    })
            } else {
                console.log("No panel for assign!");
            }

        })
        .catch(err => {
            console.log(err.message);
        })
})


module.exports = router

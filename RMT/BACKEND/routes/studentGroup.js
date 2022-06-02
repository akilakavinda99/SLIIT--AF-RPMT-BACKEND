const router = require('express').Router()
let StudentGroup = require('../models/studentGroup')

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


module.exports = router

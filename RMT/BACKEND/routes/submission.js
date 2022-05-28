const router = require("express").Router();
let Submission = require("../models/submission");

// Create new submission
router.route("/create").post((req, res) => {
  const newData = req.body;

  const newSubmission = new Submission(newData);
  newSubmission
    .save()
    .then(() => {
      res.status(200).send({ status: "Submission successfully created." });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ error: "Error with creating the submission." });
    });
});

// Get all submisions
router.route("/").get((req, res) => {
  Submission.find()
    .then((submissions) => {
      res.status(200).send({
        status: "Data successfully fetched.",
        submissions: submissions,
      });
    })
    .catch((err) => {
      res.status(500).send({ error: "Error with fetchin data." });
    });
});

// Get all  available submisions
router.route("/availableSubmissions").get((req, res) => {
  console.log("awawa");
  Submission.find({
    available: true,
  })
    .then((submissions) => {
      res.status(200).send({
        status: "Data successfully fetched.",
        submissions: submissions,
      });
    })
    .catch((err) => {
      res.status(500).send({ error: "Error with fetchin data." });
    });
});

// Get specific submission
router.route("/:submissionId").get((req, res) => {
  const submissionId = req.params.submissionId;

  Submission.findById(submissionId)
    .then((submission) => {
      res
        .status(200)
        .send({ status: "Data successfully fetched.", submission });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ error: err.message });
    });
});

// Get specific submission
router.route("/update/:submissionId").put((req, res) => {
  const submissionId = req.params.submissionId;
  const newData = req.body;

  Submission.findByIdAndUpdate(submissionId, newData)
    .then(() => {
      res.status(200).send({ status: "Submission updated." });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ error: "Error with updating data." });
    });
});

// Delete submission
router.route("/delete/:submissionId").delete((req, res) => {
  const submissionId = req.params.submissionId;
  // console.log(submissionId);

  Submission.findByIdAndDelete(submissionId)
    .then(() => {
      res.status(200).send({ status: "Submission successfully deleted." });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ error: "Error with deleting submission." });
    });
});

module.exports = router;

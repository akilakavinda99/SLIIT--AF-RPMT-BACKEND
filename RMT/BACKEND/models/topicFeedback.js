const mongoose = require('mongoose')
const Schema = mongoose.Schema

const topicFeedbackSchema = new Schema({

    submissionName: {
        type: String,
        required: true
    },
    submissionType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    fileTypes: {
        type: Object,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Boolean,
        default: false
    }
})

const Submission = mongoose.model("Submission", submissionSchema)
module.exports = Submission;
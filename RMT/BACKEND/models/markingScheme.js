const mongoose = require("mongoose")
const Schema = mongoose.Schema

const markingSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    postedDate: {
        type: Date,
        default: Date.now
    },
    lastModified:  {
        type: Date,
        default: Date.now
    },
    marking: {
        type: String
    },
    available: {
        type: Boolean,
        default: false
    }

})


const MarkingScheme = mongoose.model("MarkingScheme", markingSchema)
module.exports = MarkingScheme

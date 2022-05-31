const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const staffSchema = new Schema({

    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    researcharea: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    panel: {
        type: Object,
        required: false
    },
    isAccepted: {
        type: Boolean,
        default: false
    }
})

const Staff = mongoose.model("Staff", staffSchema);
module.exports = Staff;
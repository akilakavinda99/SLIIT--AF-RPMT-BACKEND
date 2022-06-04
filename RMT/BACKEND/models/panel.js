const mongoose = require("mongoose");
const Admin = require("./admin");
const Schema = mongoose.Schema;

const panelSchema = new Schema({

    panelName: {
        type: String,
        required: true
    },
    panelDesc: {
        type: String,
        default: "No description..."
    },
    panelMembers: {
        type: Object
    }
})


const Panel = mongoose.model("Panle", panelSchema);
module.exports = Panel;

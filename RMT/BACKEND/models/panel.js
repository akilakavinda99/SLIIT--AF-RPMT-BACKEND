const mongoose = require("mongoose");
const Admin = require("./admin");
const Schema = mongoose.Schema;

const panelSchema = new Schema({

    panelName: {
        type: String,
        required: true
    },
    panelMembers: {
        type: Object
    }
})


const Panel = mongoose.model("Panle", panelSchema);
module.exports = Panel;

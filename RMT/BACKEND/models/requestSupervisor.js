const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const requestSupervisorSchema = new Schema({

    name: {
        type: String,
        required: true
    },
   
    requestedDate: {
        type: String,
        required: true
    }


})

const requestSupervisor = mongoose.model("requestSupervisor", requestSupervisorSchema);
module.exports = requestSupervisor;

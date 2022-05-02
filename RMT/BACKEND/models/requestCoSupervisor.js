const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const requestCoSupervisorSchema = new Schema({

    name: {
        type: String,
        required: true
    },
   
    requestedDate: {
        type: String,
        required: true
    }


})

const requestCoSupervisor = mongoose.model("requestCoSupervisor", requestCoSupervisorSchema);
module.exports = requestCoSupervisor;
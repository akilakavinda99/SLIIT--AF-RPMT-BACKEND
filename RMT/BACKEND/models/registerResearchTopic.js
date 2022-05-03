const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const registerResearchSchema = new Schema({

    name: {
        type: String,
        required: true
    },
   
    topic: {
        type: String,
        required: true
    }


})

const registerResearch = mongoose.model("registerResearch", registerResearchSchema);
module.exports = registerResearch;
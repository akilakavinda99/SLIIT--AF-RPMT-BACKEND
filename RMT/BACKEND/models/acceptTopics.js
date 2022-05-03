const mongoose =  require("mongoose");
const Schema = mongoose.Schema;

const acceptTopicSchema = new Schema({

    studentId: {
        type: String,
        required: true

    },
    researchTopic: {
        type: String,
        required: true

    },
    status: {
        type: String,
        required: true

    },
    approvedDate: {
        type: String,
        required: true

    },

})

const acceptTopic = mongoose.model("acceptTopic", acceptTopicSchema);

module.exports = acceptTopic;

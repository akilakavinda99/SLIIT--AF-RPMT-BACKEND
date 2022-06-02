const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestCoSupervisorSchema = new Schema({
  topic: {
    type: String,
    required: true,
  },

  requestedDate: {
    type: Date,
    default: Date.now,
  },
  groupId: {
    type: String,
    required: true,
  },
  supervisorRequestStatus: {
    type: String,
    default: "Pending",
  },
});

const requestCoSupervisor = mongoose.model(
  "requestCoSupervisor",
  requestCoSupervisorSchema
);
module.exports = requestCoSupervisor;

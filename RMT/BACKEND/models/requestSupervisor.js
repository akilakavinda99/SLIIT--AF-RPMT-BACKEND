const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSupervisorSchema = new Schema({
  topic: {
    type: String,
    required: true,
  },

  requestedDate: {
    type: String,
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
  supervisorId: {
    type: String,
    required: true,
  },
});

const requestSupervisor = mongoose.model(
  "requestSupervisor",
  requestSupervisorSchema
);
module.exports = requestSupervisor;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSupervisorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  requestedDate: {
    type: String,
    required: true,
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

const requestSupervisor = mongoose.model(
  "requestSupervisor",
  requestSupervisorSchema
);
module.exports = requestSupervisor;

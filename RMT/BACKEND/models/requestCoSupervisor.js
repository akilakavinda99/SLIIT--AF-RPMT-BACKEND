const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestCoSupervisorSchema = new Schema({
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

const requestCoSupervisor = mongoose.model(
  "requestCoSupervisor",
  requestCoSupervisorSchema
);
module.exports = requestCoSupervisor;

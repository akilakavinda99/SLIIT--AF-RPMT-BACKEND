const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentGroupSchema = new Schema({
  leaderName: {
    type: String,
    required: true,
  },
  firstMember: {
    type: String,
    required: true,
  },
  secondMember: {
    type: String,
    required: true,
  },
  thirdMember: {
    type: String,
    required: true,
  },

  hasRequestedSupervisor: {
    type: Boolean,
    default: false,
  },
  hasRequestedCoSupervisor: {
    type: Boolean,
    default: false,
  },
});

const StudentGroup = mongoose.model("StudentGroup", studentGroupSchema);
module.exports = StudentGroup;

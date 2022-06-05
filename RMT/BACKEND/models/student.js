const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  itNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  hasGroup: {
    type: Boolean,
    default: false,
  },
  groupId: {
    type: String,
    default: "No Group Yet",
  },

  roles: {
    type: Number,
    default: 1984,
  },
  groupName: {
    type: String,
    default: "No Group Yet",
  },
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;

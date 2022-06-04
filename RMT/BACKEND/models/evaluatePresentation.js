const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const evaluatePresentationSchema = new Schema({
  topic: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  groupId: {
    type: String,
    required: true,
  },
  supervisorId: {
    type: String,
    required: true,
  },
  submittorId: {
    type: String,
    required: true,
  },
});

const Presentation = mongoose.model("Presentation", evaluatePresentationSchema);
module.exports = Presentation;

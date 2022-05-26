const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const registerResearchSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  topic: {
    type: String,
    required: true,
  },
  groupId: {
    type: String,
    required: true,
  },
  researchTopicStatus: {
    type: String,
    default: "Pending",
  },
});

const registerResearch = mongoose.model(
  "registerResearch",
  registerResearchSchema
);
module.exports = registerResearch;

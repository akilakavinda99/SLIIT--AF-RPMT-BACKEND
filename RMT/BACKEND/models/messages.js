const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const msgSchema = new Schema({
  message: {
    type: Object,
    required: true,
  },

  roomId: {
    type: String,
    required: true,
  },
});

const Messages = mongoose.model("message", msgSchema);
module.exports = Messages;

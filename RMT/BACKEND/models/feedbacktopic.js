const mongoose = require('mongoose')
const Schema=mongoose.Schema

const feedbackSchema = new Schema({
    itNumber:String,
    status:String,
    feedback:String,
})
const Feedback = mongoose.model('Feedback',feedbackSchema);
module.exports= Feedback;
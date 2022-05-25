const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    itNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    hasGroup : {
        type:Boolean,
        default:false
    },
    groupId :{
        type: String,
        default:'No Group Yet'
    }



})

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
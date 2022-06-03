const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({

    name: {
        type: String,
    },
    itNumber: {
        type: String,
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
    },

    firstname: {
        type: String,
       
    },
    lastname: {
        type: String,
        
    },
    username: {
        type: String,
       
    },
    telephone: {
        type: String,
       
    },
    researcharea: {
        type: String,
        
    },

    panel: {
        type: Object,
        
    },

    nameWithInitials: {
        type: String,
        
    },
    address: {
        type: String,
        
    },
    nic: {
        type: String,
        
    },

    mobile: {
        type: String,
        
    },
    landline: {
        type: String,
        
    }



})

const User = mongoose.model("User", userSchema);
module.exports = User;
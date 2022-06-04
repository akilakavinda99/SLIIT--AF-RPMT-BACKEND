const mongoose = require('mongoose')
const Schema=mongoose.Schema;

const presentationSchema = Schema({
    
    topic:{
        type:String,
        
    },

    itNumber: {
        type: String,
       
    },

    groupID:{
        type: String,
        
    },

    Link:{
        type: String,
    },

    date:{
        type:Date,
    }




})

const Presentation=mongoose.model("Presentation",presentationSchema)
module.exports=Presentation;
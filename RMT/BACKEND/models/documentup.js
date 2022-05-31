const mongoose = require('mongoose')

const docSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    
    document:{
        data:Buffer,
        contenentType:String
    },
    topic:{
        type:String,
        required:true
    },

    itNumber: {
        type: String,
        required: true
    },

    groupID:{
        type: String,
        required: true
    }




})

module.exports=DocumentModel=mongoose.model('documentModel',docSchema)
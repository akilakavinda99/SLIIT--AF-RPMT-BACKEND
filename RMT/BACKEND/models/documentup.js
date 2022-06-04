const mongoose = require('mongoose')

const docSchema = mongoose.Schema({
    name:{
        type:String,
        
    },
    
    document:{
        type:String,
    },
    topic:{
        type:String,
        
    },

    itNumber: {
        type: String,
       
    },

    groupID:{
        type: String,
        
    },

    date:{
        type:Date,
    }




})

module.exports=DocumentModel=mongoose.model('documentModel',docSchema)
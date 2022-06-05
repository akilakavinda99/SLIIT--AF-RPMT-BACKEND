const mongoose = require('mongoose')
const Schema=mongoose.Schema;

const docSchema = Schema({
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

// module.exports=DocumentModel=mongoose.model('documentModel',docSchema)
const DocumentModel=mongoose.model("DocumentModel",docSchema)
module.exports=DocumentModel

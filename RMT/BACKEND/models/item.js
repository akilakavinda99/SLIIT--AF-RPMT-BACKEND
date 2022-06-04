const mongoose = require('mongoose')
const Schema=mongoose.Schema

const itemSchema = new Schema({
    title:String,
    image:String
},{ timestamps: true })
const Item = mongoose.model('Item',itemSchema);
module.exports= Item;
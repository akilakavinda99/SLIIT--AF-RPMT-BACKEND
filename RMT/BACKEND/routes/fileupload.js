// import express from 'express';
// const router =require("express").Router()
// // import { getItems,createItem } from '../controller/fileupload';
// // const router = express.Router();
// const fileup=require('../controller/fileupload')


// router.get('/doc',fileup.getItems)
// router.post('/docup',fileup.createItem);
// module.exports=router;

const router = require("express").Router()
const fileup=require("../models/documentup");

router.route("/docup").post((req,res)=>{
    // console.log('createitem',req.body)
    const Fileup = new fileup(req.body);
    const itNumber=Fileup.itNumber;
    console.log(itNumber)

    fileup.findOne({
        itNumber:itNumber,
    })
    .then((fileup)=>{
        if(!fileup){
            Fileup.save()
            .then(()=>{
                res.json("Submission Successfully Added to the system")
            })
            .catch((error)=>{
                res.json(error);
                console.log(error);
            });
        }else{
            res.status(409).send({
                error:"Submission already exists.",
            });
        }
    })
    .catch((error)=>{
        res.send("Error : "+error.message);
    });
    // try {
    //     Fileup.save();
    //     res.status(201).json(Fileup);
    // } catch (error) {
        
    // }

})

router.route("/docup").get(async(req,res)=>{
    try{
        // console.log("HIIII");
        const Fileup= await fileup.find()
        // console.log(Fileup);
        res.status(200).json(Fileup)
    }catch(error){
        res.status(404).json({message:error.message});
    }
})

router.route("/docup/:id").get(async(req, res) => {

    let fID = req.params.id
    console.log(fID)

     await fileup.findOne({
        itNumber:fID
     }).then((file)=>{
        res.status(200).send({
            status: "Data successfully fetched",
            fileData:file
        })
     }).catch((err)=>{
         console.log(err)
     })
            
        
        
   
})

module.exports=router
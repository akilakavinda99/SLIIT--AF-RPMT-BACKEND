const router = require("express").Router();
const { Router } = require("express");
let Presentation=require("../models/presentation");

router.route("/").post((req, res)=>{
    const topic=req.body.topic;
    const itNumber=req.body.itNumber;
    const groupID=req.body.groupID;
    const Link=req.body.Link;
    const date=req.body.date;

    const newPresentation=new Presentation({
        topic,
        itNumber,
        groupID,
        Link,
        date
    })

    Presentation.findOne({
        itNumber: itNumber,
      })
        .then((Presentation) => {
          if (!Presentation) {
            newPresentation
              .save()
              .then(() => {
                res.json("New Presentation added to the system.");
              })
              .catch((error) => {
                res.json(error);
                console.log(error);
              });
          } else {
            res.status(409).send({
              error: "Presentation already exists.",
            });
          }
        })
        .catch((err) => {
          res.send("Error: " + err.message);
        });

})

router.route("/presentationview").get(async(req,res)=>{
    try{
        const Fileup= await Presentation.find()
        console.log(Fileup);
        res.status(200).json(Fileup)
    }catch(error){
        res.status(404).json({message:error.message});
    }
})


router.route("/presentation/:id").get(async(req, res) => {

    let fID = req.params.id
    console.log(fID)

     await Presentation.findOne({
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
module.exports = router;
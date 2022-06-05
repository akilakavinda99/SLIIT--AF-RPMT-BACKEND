const router =require("express").Router()
const feedback=require("../models/feedbacktopic")

router.route("/add").post((req,res)=>{

    const Feedback = new feedback(req.body);
    const itNumber=Feedback.itNumber;
    console.log(itNumber)

    feedback.findOne({
        itNumber:itNumber,
    })
    .then((feedback)=>{
        if(!feedback){
            Feedback.save()
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

})
module.exports=router
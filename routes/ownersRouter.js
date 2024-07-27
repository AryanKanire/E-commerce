const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model")


//for power shell we use the command$env:NODE_ENV="development" and for cmd set NODE_ENV=development
if(process.env.NODE_ENV==="development"){
    router.post("/create",async (req,res)=>{
        let owner = await ownerModel.find();
        if(owner.length>0) {
            return res.send(503).send("you don't have authorite to create owner")
        }
        let{fullname,email,password} = req.body;
        let createdOwner = await ownerModel.create({
            fullname,
            email,
            password,
        })
        res.status(201).send(createdOwner);
    })
};


router.get("/admin",(req,res)=>{
    let success = req.flash("success")
    res.render("createproducts",{success})
})

module.exports = router
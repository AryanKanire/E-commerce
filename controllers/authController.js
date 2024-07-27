const userModel = require("../models/user-model");
const bcrypt  =require("bcrypt");
const jwt = require("jsonwebtoken");
const {genrateToken} = require("../utils/genrateToken")

module.exports.registerUser =async (req,res)=>{
        try{
            let {email,password,fullname} = req.body;

            let user = await userModel.findOne({email:email});
            if(user){
                req.flash("error","you already have an account");
                return res.status(401).redirect("/")
            }
    
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(password,salt,async (err,hash)=>{
                    if(err) return res.send(err.message);
                    else {
                        let user  = await userModel.create({
                            email,
                            fullname,
                            password : hash,
                        })
                        let token = genrateToken(user)
                        res.cookie("token",token);
                        res.redirect("/shop"); 
                    };
                });
            });
    
        }
        catch(err){
            console.log(err.message); 
        }
}

module.exports.loginUser = async (req,res)=>{
    try{
        let {email,password} = req.body;
        
        let user = await userModel.findOne({email:email});
        if(!user) {
            req.flash("error","Email or Password is incorrect");
            return res.redirect("/")
        };


        bcrypt.compare(password,user.password, (err,result)=>{
            if(result){
                let token = genrateToken(user);
                res.cookie("token",token);
                res.redirect("/shop");
            }
            else{
                req.flash("error","Email or Password is incorrect");
                return res.redirect("/")
            }
        })
    }
    catch(err){
        console.log(err);
    }
}

module.exports.logout = (req,res)=>{
    res.cookie("token","");
    res.redirect("/")
}
const express = require("express");
const router = express.Router();
const islogedIn = require("../middelwares/islogedin");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/", (req, res) => {
    const error = req.flash("error"); // or an actual error message if there is one

    res.render("index", { error: error, loggedin:false });
});

router.get("/shop", islogedIn,async (req,res)=>{
    let products = await productModel.find()
    let success = req.flash("success");
    res.render("shop",{products , success});
})

router.get("/cart", islogedIn,async (req,res)=>{
    let user = await userModel.findOne({email: req.user.email}).populate("cart");
    const bill = (Number(user.cart[0].price)+20)-Number(user.cart[0].discount)
    res.render("cart",{user,bill});
})

router.get("/addtocard/:productid", islogedIn,async (req,res)=>{
    let user = await userModel.findOne({email:req.user.email});
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success","added to cart");
    res.redirect("/shop");
})

router.get("/logout", islogedIn,async (req,res)=>{
    res.render("shop");
})

router.get("/discounted",islogedIn,async(req,res)=>{
    let products = await productModel.find()
    let success = req.flash("success");
    res.render("discount",{products , success});
})

router.get("/:id",islogedIn,async(req,res)=>{
    let {id} = req.params;
    let item = await productModel.findById(id);
    if (!item) {
        req.flash("error", "product not found");
        return res.redirect("/shop");
    }
    
    res.render("product",{item})
})

module.exports = router;
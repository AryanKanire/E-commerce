const express = require("express");
require('dotenv').config();  // with the help of this line we can use all env data
const app = express();
const cookieParser  =  require("cookie-parser");
const path = require("path");
const ownersRouter = require("./routes/ownersRouter");
const usersRouter = require("./routes/usersRouter");
const productsRouter = require("./routes/productsRouter")
const index = require("./routes/index")
const expressSession = require("express-session");
const flash = require("connect-flash");

const db = require("./config/mongoose-connection")

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(
    expressSession({
        resave:false,
        saveUninitialized:false,
        secret: process.env.EXPRESS_SESSION_SECRET,
    })
)
app.use(flash());
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");

app.use("/", index);
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

app.listen(3000);
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");

const connectDB = require("./config/db");
const User = require("./Models/User");
const Interview=require("./Models/interview");

const app = express();

const PORT = 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "frontend")));
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }

});

const upload = multer({
    storage: storage
});
app.post("/register",async(req,res)=>{

  try{
    const {name,email,password}=req.body;
    const existingUser=await User.findOne({email});
    if(existingUser){
        return res.status(400).send("User already exists");
    }
    const user=new User({name,email,password});
    await user.save();
    res.status(201).send("User registered successfully");
}catch(err){
    console.log(err.message);
    res.send("registration failed");
}})

app.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.send("Invalid email or password");
        }
        if(user.password!==password){
            return res.send("Invalid Password");
        }
        return res.redirect("/dashboard.html");
    }catch(err){
        console.log(err.message);
        res.send("Login failed");
    }
});

app.post("/upload-resume",upload.single("resume"),async(req,res)=>{
    try{
        console.log("Resume uploaded:");
        console.log(req.file);

    }catch(err){
        console.log(error.message);
        res.send("Resume upload failed");
    }
})


app.post("/add-interview",async(req,res)=>{
    try{
        const {company,date,round}=req.body;

        const interview=new Interview({company,date,round});
        await interview.save();
        res.send("Interview added successfully");
    }
    catch(err){
        console.log(err.message);
        res.send("Failed to add interview");
    }
})
app.use(express.static(path.join(__dirname,"frontend")));
const port=8900;
app.listen(port,()=>{
    console.log("app is listening");
})
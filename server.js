const express=require("express");
const app=express();
const path=require("path");
app.use(express.static(path.join(__dirname,"frontend")));
port=8900;
app.listen(port,()=>{
    console.log("app is listening");
})
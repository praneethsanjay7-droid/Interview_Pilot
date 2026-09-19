const mongoose=require("mongoose");

const connectDB=async()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/interviewPilot");
        console.log("mongoDB connected");
    }catch(error){
        console.log("mongodb connection failed");
        console.log(err.message);
    }
}

module.exports=connectDB;
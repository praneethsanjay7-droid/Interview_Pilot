const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const interviewSchema=new Schema({
    company:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    round:{
        type:String,
        required:true
    }
    
})

const Interview=mongoose.model("Interview",interviewSchema);
module.exports=Interview;
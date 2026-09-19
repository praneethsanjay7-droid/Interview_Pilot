require("dotenv").config();
const fs=require("fs");
const express = require("express");
const { GoogleGenAI,createUserContent,createPartFromUri } = require("@google/genai");
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");

const connectDB = require("./config/db");
const User = require("./Models/User");
const Interview = require("./Models/Interview");
const PreparationPlan=require("./Models/PreparationPlan");

const app = express();

const PORT = process.env.PORT || 3001;
const uploadDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "frontend")));
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadDir);
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

let uploadedResumePath = null;
app.post("/upload-resume", upload.single("resume"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No resume uploaded");
        }

        uploadedResumePath = path.resolve(req.file.path);

        if (!fs.existsSync(uploadedResumePath)) {
            return res.status(400).send("Resume file not found. Please upload the resume again.");
        }

        console.log("Resume uploaded:");
        console.log(req.file);
        res.send("Resume uploaded successfully");
    } catch (err) {
        console.log(err.message);
        res.send("Resume upload failed");
    }
});


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
app.use(express.static(path.join(__dirname, "frontend")));


app.get("/test-gemini", async (req, res) => {
    if (!ai) {
        return res.status(500).json({
            error: "Gemini API key is not configured. Add GEMINI_API_KEY to your local .env file before calling this route."
        });
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: [
                {
                    role: "user",
                    parts: [{ text: "Say hello to Interview Pilot in one sentence." }],
                },
            ],
        });

        const text = response?.text || response?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "No response returned";
        res.send(text);
    } catch (err) {
        console.log("Gemini Error:");
        console.log(err.message);
        console.log("Full error:", err);
        res.status(500).json({
            error: "Gemini API failed",
            details: err?.message || "Unknown Gemini error",
            status: err?.status || null,
            code: err?.code || null,
            body: err?.body || null,
        });
    }
});


app.get("/generate-plan", async (req, res) => {
    try {
        if (!ai) {
            return res.status(500).json({
                error: "Gemini API key is not configured. Add GEMINI_API_KEY to your local .env file before generating a plan."
            });
        }

        if (!uploadedResumePath) {
            return res.send("Please upload a resume first");
        }

        const interview = await Interview.findOne().sort({ date: 1 });

        if (!interview) {
            return res.send("Please add an interview first");
        }

        const resumeFile = await ai.files.upload({
            file: uploadedResumePath,
            config: {
                mimeType: "application/pdf"
            }
        });




        const prompt = `
You are an interview preparation assistant.

Analyze the candidate's resume and upcoming interview.

Interview details:

Company: ${interview.company}
Date: ${interview.date}
Round: ${interview.round}

Create a simple personalized interview preparation plan.

Include:

1. Resume strengths relevant to the interview
2. Important topics to revise
3. Technical preparation
4. Project preparation
5. HR preparation
6. A day-wise preparation plan
7. Final interview tips

Keep the plan practical and concise.
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: createUserContent([
                createPartFromUri(resumeFile.uri, resumeFile.mimeType),
                prompt
            ])
        });

        const text = response?.text || response?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "No response returned";

        const preparationPlan = new PreparationPlan({
            interviewId: interview._id,
            company: interview.company,
            plan: text
        });

        await preparationPlan.save();

        res.send(`<pre>${text}</pre>`);

    } catch (error) {
        console.log("Plan generation error:");
        console.log(error);
        res.status(500).send("Failed to generate preparation plan");
    }
});
app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`);
});